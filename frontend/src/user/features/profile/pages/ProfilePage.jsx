import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile.js'
import AccountField from '../../auth/components/AccountField.jsx'
import CustomerAccountNav from '../../../layouts/components/CustomerAccountNav.jsx'
import '../../../styles/account.css'
export default function ProfilePage() {
  const {
    profile,
    form,
    setForm,
    editing,
    setEditing,
    busy,
    message,
    setMessage,
    error,
    setError,
    save,
  } = useProfile()
  if (!profile)
    return (
      <div className="customer-account" role="status">
        {error || 'Đang tải hồ sơ của bạn…'}
      </div>
    )
  return (
    <div className="customer-account">
      <CustomerAccountNav />
      <div className="account-heading">
        <div>
          <p className="account-eyebrow">Tài khoản MEOMEO</p>
          <h1>Trang cá nhân</h1>
          <p>Thông tin của bạn cho mỗi lần hẹn cùng bé.</p>
        </div>
        <Link className="account-text-link" to="/pets">
          Thú cưng của tôi →
        </Link>
      </div>
      <div className="profile-layout">
        <aside className="profile-overview">
          <span className="profile-initial">
            {profile.fullName.trim().charAt(0)}
          </span>
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
          <span className="account-tag">Tài khoản khách hàng</span>
          <p className="account-fine">
            Thành viên từ{' '}
            {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </aside>
        <section className="profile-information">
          <div className="account-section-heading">
            <h2>Thông tin liên hệ</h2>
            {!editing && (
              <button
                className="account-secondary"
                onClick={() => {
                  setEditing(true)
                  setMessage('')
                }}
              >
                Chỉnh sửa thông tin
              </button>
            )}
          </div>
          <form onSubmit={save} noValidate>
            <fieldset disabled={busy}>
              {editing ? (
                <>
                  <AccountField
                    label="Họ và tên"
                    name="fullName"
                    maxLength={100}
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        fullName: e.target.value,
                      }))
                    }
                  />
                  <AccountField
                    label="Số điện thoại (không bắt buộc)"
                    name="phone"
                    type="tel"
                    value={form.phone || ''}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <dl className="account-data">
                  <div>
                    <dt>Họ và tên</dt>
                    <dd>{profile.fullName}</dd>
                  </div>
                  <div>
                    <dt>Số điện thoại</dt>
                    <dd>{profile.phone || 'Chưa bổ sung'}</dd>
                  </div>
                </dl>
              )}
              <dl className="account-data">
                <div>
                  <dt>Email tài khoản</dt>
                  <dd>
                    {profile.email}
                    <small>Email dùng để nhận diện tài khoản.</small>
                  </dd>
                </div>
                <div>
                  <dt>Phương thức đăng nhập</dt>
                  <dd>
                    {profile.provider === 'GOOGLE'
                      ? 'Google'
                      : 'Email và mật khẩu'}
                  </dd>
                </div>
                <div>
                  <dt>Trạng thái</dt>
                  <dd>Đang hoạt động</dd>
                </div>
              </dl>
              {error && (
                <p className="account-error" role="alert">
                  {error}
                </p>
              )}
              {message && (
                <p className="account-notice" role="status">
                  {message}
                </p>
              )}
              {editing && (
                <div className="account-actions">
                  <button className="account-primary">
                    {busy ? 'Đang lưu…' : 'Lưu thay đổi'}
                  </button>
                  <button
                    className="account-secondary"
                    type="button"
                    onClick={() => {
                      setForm(profile)
                      setEditing(false)
                      setError('')
                    }}
                  >
                    Hủy chỉnh sửa
                  </button>
                </div>
              )}
            </fieldset>
          </form>
        </section>
      </div>
    </div>
  )
}
