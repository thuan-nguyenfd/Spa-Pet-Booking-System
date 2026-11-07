import { MOCK_PETS } from '../../pets/mocks/pets.js'
const KEY = 'meomeo:customers:v1',
  SESSION = 'meomeo:session:v1'
let state
export const credentials = new Map([['minhthuan@meomeo.vn', 'Meomeo123!']])
export function database() {
  if (!state) {
    try {
      state = JSON.parse(localStorage.getItem(KEY))
    } catch {
      /* initial data */
    }
    if (!Array.isArray(state?.users) || !Array.isArray(state?.pets))
      state = {
        users: [
          {
            id: 1,
            fullName: 'Minh Thuận',
            email: 'minhthuan@meomeo.vn',
            phone: '0901234567',
            provider: 'LOCAL',
            role: 'CUSTOMER',
            status: 1,
            createdAt: '2026-10-26T08:00:00',
          },
        ],
        pets: MOCK_PETS.map((p) => ({
          ...p,
          type: p.species === 'Mèo' ? 'CAT' : 'DOG',
          ownerId: 1,
          status: 1,
        })),
      }
  }
  return state
}
export function persist() {
  const db = database()
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        ...db,
        pets: db.pets.map((p) => ({
          ...p,
          imageUrl: /^(data:|blob:)/.test(p.imageUrl || '') ? '' : p.imageUrl,
        })),
      }),
    )
  } catch {
    throw new Error('Không thể lưu dữ liệu trên trình duyệt.')
  }
}
export function setSession(id, remember = false) {
  sessionStorage.removeItem(SESSION)
  localStorage.removeItem(SESSION)
  if (id)
    (remember ? localStorage : sessionStorage).setItem(SESSION, String(id))
}
export function currentUser() {
  let id
  try {
    id = Number(
      sessionStorage.getItem(SESSION) || localStorage.getItem(SESSION),
    )
  } catch {
    return null
  }
  return database().users.find((u) => u.id === id && u.status === 1) ?? null
}
export function requireUser() {
  const user = currentUser()
  if (!user) throw new Error('Bạn cần đăng nhập để tiếp tục.')
  return user
}
export const wait = () => new Promise((resolve) => setTimeout(resolve, 300))
export const copy = (value) => structuredClone(value)
