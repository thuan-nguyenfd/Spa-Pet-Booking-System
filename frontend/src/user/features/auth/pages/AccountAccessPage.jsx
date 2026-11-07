import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.jsx'
import { authService } from '../services/authService.js'
import { validateAccount } from '../validation/accountValidation.js'
import AccountField from '../components/AccountField.jsx'
import UserHeader from '../../../layouts/components/UserHeader.jsx'
import photo from '../../../../assets/images/editorial/portrait.jpg'
import '../../../styles/account.css'

export default function AccountAccessPage({ register = false }) {
  const { user, login } = useAuth(),
    navigate = useNavigate(),
    location = useLocation()
  const [form, setForm] = useState({
    fullName: '',
    email: location.state?.email || '',
    phone: '',
    password: '',
    confirmPassword: '',
    remember: false,
  })
  const [errors, setErrors] = useState({}),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false)
  const destination =
    location.state?.from?.startsWith('/') &&
    !location.state.from.startsWith('//') &&
    !['/login', '/register'].includes(location.state.from)
      ? location.state.from
      : '/profile'
  if (user) return <Navigate to={destination} replace />
  const update = (e) => {
    setForm((v) => ({
      ...v,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    }))
    setErrors((v) => ({ ...v, [e.target.name]: '' }))
    setMessage('')
  }
  async function submit(e) {
    e.preventDefault()
    const validation = validateAccount(form, register)
    setErrors(validation)
    if (Object.keys(validation).length) return
    setBusy(true)
    setMessage('')
    try {
      if (register) {
        await authService.register(form)
        navigate('/login', {
          replace: true,
          state: { email: form.email, registered: true, from: destination },
        })
      } else {
        await login(form)
        navigate(destination, { replace: true })
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }
  const field = (name, label, type = 'text', autoComplete) => (
    <AccountField
      key={name}
      name={name}
      label={label}
      type={type}
      autoComplete={autoComplete}
      value={form[name]}
      onChange={update}
      error={errors[name]}
      disabled={busy}
    />
  )
  return (
    <div className="meomeo-home">
      <UserHeader />
      <main
        className={`access-page wrap ${register ? 'access-page--register' : ''}`}
      >
        <aside className="access-story">
          <p className="account-eyebrow">MEOMEO · Chăm sóc thú cưng</p>
          <h2>
            {register
              ? 'Bắt đầu một\ncuộc hẹn tốt đẹp.'
              : 'Chăm chút cho bé,\ntừ lần hẹn đầu.'}
          </h2>
          <p>
            {register
              ? 'Lưu thông tin thú cưng và chuẩn bị cho lần hẹn tiếp theo.'
              : 'Trở lại với những người bạn nhỏ và những cuộc hẹn chăm sóc.'}
          </p>
          <div className="access-photo">
            <img
              src={photo}
              alt="Chú chó Pug trên nền vàng"
              width="1400"
              height="1867"
            />
          </div>
          <span className="access-wordmark">MEOMEO</span>
        </aside>
        <section className="access-form">
          <p className="account-eyebrow">
            {register ? 'Bắt đầu cùng MEOMEO' : 'Mừng bạn trở lại'}
          </p>
          <h1>{register ? 'Tạo tài khoản' : 'Đăng nhập'}</h1>
          <p>
            {register
              ? 'Một chút thông tin để mình làm quen nhé.'
              : 'Đăng nhập để quản lý hồ sơ và lịch hẹn của bé.'}
          </p>
          <form noValidate onSubmit={submit}>
            <fieldset disabled={busy}>
              {register && field('fullName', 'Họ và tên', 'text', 'name')}
              {field('email', 'Email', 'email', 'email')}
              {register &&
                field('phone', 'Số điện thoại (không bắt buộc)', 'tel', 'tel')}
              {field(
                'password',
                'Mật khẩu',
                'password',
                register ? 'new-password' : 'current-password',
              )}
              {register &&
                field(
                  'confirmPassword',
                  'Nhập lại mật khẩu',
                  'password',
                  'new-password',
                )}
              {!register && (
                <label className="account-check">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={update}
                  />{' '}
                  Ghi nhớ đăng nhập trên thiết bị này
                </label>
              )}
              {location.state?.registered && (
                <p className="account-notice" role="status">
                  Đã tạo tài khoản. Bạn đăng nhập để tiếp tục nhé.
                </p>
              )}
              {message && (
                <p className="account-error" role="alert">
                  {message}
                </p>
              )}
              <button className="account-primary" disabled={busy}>
                {busy
                  ? 'Đang xử lý…'
                  : register
                    ? 'Tạo tài khoản'
                    : 'Đăng nhập'}
              </button>
              {!register && (
                <button
                  className="account-secondary access-google"
                  type="button"
                  onClick={() =>
                    setMessage(
                      'Đây là bản trình diễn. Đăng nhập Google sẽ được kết nối sau; bạn dùng tài khoản mẫu bên dưới nhé.',
                    )
                  }
                >
                  Đăng nhập với Google
                </button>
              )}
            </fieldset>
          </form>
          <p className="access-switch">
            {register ? 'Bạn đã có tài khoản? ' : 'Bạn chưa có tài khoản? '}
            <Link
              to={register ? '/login' : '/register'}
              state={{ from: destination }}
            >
              {register ? 'Đăng nhập' : 'Tạo tài khoản'}
            </Link>
          </p>
          <details className="account-demo">
            <summary>Tài khoản dùng thử · Bản trình diễn</summary>
            <p>
              Email: minhthuan@meomeo.vn
              <br />
              Mật khẩu: Meomeo123!
            </p>
            <p>
              Mật khẩu tài khoản mới chỉ giữ trong bộ nhớ cho phiên mở ứng dụng
              này. Ghi nhớ đăng nhập chỉ mô phỏng phiên sử dụng.
            </p>
          </details>
        </section>
      </main>
    </div>
  )
}
