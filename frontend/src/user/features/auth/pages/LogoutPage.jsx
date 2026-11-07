import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import UserHeader from '../../../layouts/components/UserHeader.jsx'
import photo from '../../../../assets/images/editorial/golden.jpg'
import '../../../styles/account.css'
export default function LogoutPage() {
  const { logout } = useAuth()
  useEffect(() => {
    logout()
  }, [])
  return (
    <div className="meomeo-home">
      <UserHeader />
      <main className="logout-page">
        <section>
          <p className="account-eyebrow">Tạm biệt từ MEOMEO</p>
          <span className="logout-mark" aria-hidden="true">
            ↗
          </span>
          <h1>
            Bạn đã đăng xuất.
            <br />
            Hẹn gặp lại bạn và bé.
          </h1>
          <p>Hồ sơ và thông tin thú cưng đã lưu vẫn ở đây cho lần ghé sau.</p>
          <div className="account-actions">
            <Link className="account-primary" to="/login">
              Đăng nhập lại <span aria-hidden="true">→</span>
            </Link>
            <Link className="account-secondary" to="/">
              Về trang chủ
            </Link>
          </div>
        </section>
        <div className="logout-photo">
          <img src={photo} alt="Chú chó Golden ngậm một bông hoa" />
        </div>
      </main>
    </div>
  )
}
