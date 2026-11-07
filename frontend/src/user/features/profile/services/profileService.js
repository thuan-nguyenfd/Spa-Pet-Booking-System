import {
  copy,
  database,
  persist,
  requireUser,
  wait,
} from '../mocks/customerRepository.js'
import { selectService } from '../../../../app/config/dataSource.js'
export const profileService = selectService({
  async getProfile() {
    await wait()
    return copy(requireUser())
  },
  async updateProfile(input) {
    await wait()
    if (!input.fullName?.trim() || input.fullName.trim().length > 100)
      throw new Error('Họ tên cần từ 1 đến 100 ký tự.')
    if (input.phone && !/^\+?[0-9]{9,15}$/.test(input.phone))
      throw new Error('Số điện thoại cần từ 9 đến 15 chữ số.')
    const user = requireUser()
    if (
      input.phone &&
      database().users.some((u) => u.id !== user.id && u.phone === input.phone)
    )
      throw new Error('Số điện thoại này đã được sử dụng bởi tài khoản khác.')
    Object.assign(user, {
      fullName: input.fullName.trim(),
      phone: input.phone || null,
      updatedAt: new Date().toISOString(),
    })
    persist()
    return copy(user)
  },
})
