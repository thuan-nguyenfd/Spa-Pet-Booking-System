import {
  copy,
  credentials,
  currentUser,
  database,
  persist,
  setSession,
  wait,
} from '../../profile/mocks/customerRepository.js'
import { selectService } from '../../../../app/config/dataSource.js'
import { validateAccount } from '../validation/accountValidation.js'
// UI demo only: credentials stay in memory, never in browser storage.
export const authService = selectService({
  async getCurrentUser() {
    await wait()
    return copy(currentUser())
  },
  async login({ email, password, remember }) {
    await wait()
    const normalized = email.trim().toLowerCase()
    const user = database().users.find(
      (u) => u.email === normalized && u.status === 1,
    )
    if (!user || credentials.get(normalized) !== password)
      throw new Error(
        'Email hoặc mật khẩu chưa đúng. Tài khoản mới tạo chỉ đăng nhập được trong phiên mở ứng dụng này.',
      )
    setSession(user.id, remember)
    return copy(user)
  },
  async register(input) {
    await wait()
    if (Object.keys(validateAccount(input, true)).length)
      throw new Error('Bạn kiểm tra lại thông tin đăng ký nhé.')
    const db = database(),
      email = input.email.trim().toLowerCase()
    if (db.users.some((u) => u.email === email))
      throw new Error('Email này đã được đăng ký.')
    if (input.phone && db.users.some((u) => u.phone === input.phone))
      throw new Error('Số điện thoại này đã được đăng ký.')
    const user = {
      id: Math.max(0, ...db.users.map((u) => u.id)) + 1,
      email,
      fullName: input.fullName.trim(),
      phone: input.phone || null,
      provider: 'LOCAL',
      role: 'CUSTOMER',
      status: 1,
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    persist()
    credentials.set(email, input.password)
    return copy(user)
  },
  async logout() {
    setSession(null)
  },
})
