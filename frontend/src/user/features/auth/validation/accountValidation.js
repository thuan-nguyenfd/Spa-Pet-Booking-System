export function validateAccount(v, register = false) {
  const e = {}
  if (!v.email?.trim()) e.email = 'Bạn nhập email nhé.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) || v.email.length > 100)
    e.email = 'Email chưa đúng định dạng.'
  if (register && (!v.fullName?.trim() || v.fullName.trim().length > 100))
    e.fullName = 'Họ tên cần từ 1 đến 100 ký tự.'
  if (register && v.phone && !/^\+?[0-9]{9,15}$/.test(v.phone))
    e.phone = 'Số điện thoại cần từ 9 đến 15 chữ số.'
  if (!v.password) e.password = 'Bạn nhập mật khẩu nhé.'
  else if (register && v.password.length < 8)
    e.password = 'Mật khẩu cần ít nhất 8 ký tự.'
  if (register && v.confirmPassword !== v.password)
    e.confirmPassword = 'Mật khẩu xác nhận chưa khớp.'
  return e
}
