import {
  copy,
  currentUser,
  database,
  persist,
  wait,
} from '../../profile/mocks/customerRepository.js'
import { selectService } from '../../../../app/config/dataSource.js'
import { PET_TYPES as TYPES } from '../../profile/mappers/customerMapper.js'
const guestPets = []
const owner = () => currentUser()?.id ?? null
const records = () => (owner() ? database().pets : guestPets)
function find(id) {
  const p = records().find(
    (p) => p.id === Number(id) && p.ownerId === owner() && p.status === 1,
  )
  if (!p) throw new Error('Không tìm thấy thú cưng trong tài khoản của bạn.')
  return p
}
export function validatePet(v) {
  if (!v.name?.trim() || v.name.trim().length > 100)
    return 'Tên thú cưng cần từ 1 đến 100 ký tự.'
  if (!TYPES[v.type] && !Object.values(TYPES).includes(v.species))
    return 'Bạn chọn loại thú cưng nhé.'
  if (
    !Number.isFinite(Number(v.weightKg)) ||
    Number(v.weightKg) <= 0 ||
    Number(v.weightKg) > 999.99 ||
    !/^\d+(\.\d{1,2})?$/.test(String(v.weightKg))
  )
    return 'Cân nặng cần lớn hơn 0, tối đa 999,99 kg và có tối đa 2 số thập phân.'
  if (v.breed?.length > 100) return 'Giống thú cưng tối đa 100 ký tự.'
  return ''
}
function fields(v) {
  const error = validatePet(v)
  if (error) throw new Error(error)
  const type = v.type || Object.keys(TYPES).find((k) => TYPES[k] === v.species)
  return {
    name: v.name.trim(),
    type,
    species: TYPES[type],
    breed: v.breed?.trim() || null,
    weightKg: Number(v.weightKg),
    imageUrl: v.imageUrl || '',
    avatarTone: 'honey',
  }
}
export const petService = selectService({
  async getMyPets() {
    await wait()
    return copy(
      records().filter((p) => p.ownerId === owner() && p.status === 1),
    )
  },
  async getPetById(id) {
    await wait()
    return copy(find(id))
  },
  async createPet(v) {
    await wait()
    const data = fields(v),
      all = records(),
      p = {
        ...data,
        id: Math.max(100, ...all.map((p) => p.id)) + 1,
        ownerId: owner(),
        status: 1,
        createdAt: new Date().toISOString(),
      }
    all.push(p)
    if (owner()) persist()
    return copy(p)
  },
  async updatePet(id, v) {
    await wait()
    const data = fields(v),
      p = find(id)
    Object.assign(p, data, { updatedAt: new Date().toISOString() })
    if (owner()) persist()
    return copy(p)
  },
  async deletePet(id) {
    await wait()
    find(id).status = 0
    if (owner()) persist()
  },
})
