import { NavLink } from 'react-router-dom'
export default function CustomerAccountNav() {
  return (
    <nav className="customer-account-nav" aria-label="Tài khoản của bạn">
      <NavLink to="/profile">Thông tin cá nhân</NavLink>
      <NavLink to="/pets">Thú cưng của tôi</NavLink>
      <NavLink to="/bookings">Lịch hẹn của tôi</NavLink>
    </nav>
  )
}
