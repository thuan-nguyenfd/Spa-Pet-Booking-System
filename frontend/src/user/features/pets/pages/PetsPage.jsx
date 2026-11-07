import { Link } from 'react-router-dom'
import { usePets } from '../hooks/usePets.js'
import PetAvatar from '../../bookings/components/create/PetAvatar.jsx'
import AccountField from '../../auth/components/AccountField.jsx'
import CustomerAccountNav from '../../../layouts/components/CustomerAccountNav.jsx'
import '../../../styles/account.css'
export default function PetsPage() {
  const {
    pets,
    loading,
    editing,
    setEditing,
    form,
    setForm,
    busy,
    error,
    setError,
    message,
    removing,
    setRemoving,
    load,
    start,
    save,
    remove,
    image,
  } = usePets()
  return (
    <div className="customer-account customer-account--pets">
      <CustomerAccountNav />
      <div className="account-heading">
        <div>
          <p className="account-eyebrow">Những người bạn nhỏ</p>
          <h1>
            Thú cưng của tôi<span className="pet-count">{pets.length}</span>
          </h1>
          <p>Lưu hồ sơ của bé, nhẹ nhàng hơn cho lần hẹn sau.</p>
        </div>
        <button
          className="account-primary"
          disabled={!!editing}
          onClick={() => start(null)}
        >
          + Thêm thú cưng
        </button>
      </div>
      {message && (
        <p className="account-notice" role="status">
          {message}
        </p>
      )}
      {error && !editing && (
        <p className="account-error" role="alert">
          {error}{' '}
          <button className="account-secondary" onClick={load}>
            Tải lại danh sách
          </button>
        </p>
      )}
      {editing && (
        <section className="pet-editor">
          <div className="account-section-heading">
            <div>
              <p className="account-eyebrow">Hồ sơ thú cưng</p>
              <h2>
                {editing === 'new'
                  ? 'Làm quen với bé'
                  : `Thông tin của ${form.name}`}
              </h2>
            </div>
            <span className="account-tag">
              {editing === 'new' ? 'Hồ sơ mới' : 'Đang chỉnh sửa'}
            </span>
          </div>
          <form noValidate onSubmit={save}>
            <fieldset disabled={busy}>
              <div className="pet-editor-grid">
                <div className="pet-image-editor">
                  <PetAvatar pet={form} />
                  <label className="account-text-link" htmlFor="pet-photo">
                    Chọn ảnh của bé
                  </label>
                  <input
                    id="pet-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={image}
                  />
                  <small>
                    Ảnh xem trước trong phiên này.
                    <br />
                    JPG, PNG, WebP · Tối đa 2 MB
                  </small>
                  {form.imageUrl && (
                    <button
                      className="account-secondary"
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                    >
                      Gỡ ảnh
                    </button>
                  )}
                </div>
                <div className="pet-form-grid">
                  <AccountField
                    label="Tên thú cưng"
                    name="pet-name"
                    value={form.name}
                    maxLength={100}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                  />
                  <div className="account-field">
                    <label htmlFor="pet-type">Loại thú cưng</label>
                    <select
                      id="pet-type"
                      value={form.type}
                      onChange={(e) =>
                        setForm((current) => ({
                          ...current,
                          type: e.target.value,
                        }))
                      }
                    >
                      <option value="DOG">Chó</option>
                      <option value="CAT">Mèo</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <AccountField
                    label="Giống (không bắt buộc)"
                    name="pet-breed"
                    value={form.breed}
                    maxLength={100}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        breed: e.target.value,
                      }))
                    }
                  />
                  <AccountField
                    label="Cân nặng (kg)"
                    name="pet-weight"
                    type="number"
                    min="0.01"
                    max="999.99"
                    step="0.01"
                    value={form.weightKg}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        weightKg: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {error && (
                <p className="account-error" role="alert">
                  {error}
                </p>
              )}
              <div className="account-actions">
                <button className="account-primary">
                  {busy ? 'Đang lưu…' : 'Lưu hồ sơ của bé'}
                </button>
                <button
                  type="button"
                  className="account-secondary"
                  onClick={() => {
                    setEditing(null)
                    setError('')
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              </div>
            </fieldset>
          </form>
        </section>
      )}
      {loading ? (
        <p role="status">Đang tải hồ sơ các bé…</p>
      ) : !pets.length && !editing ? (
        <section className="pet-empty">
          <PetAvatar pet={{ species: 'Mèo' }} />
          <h2>Chưa có hồ sơ thú cưng</h2>
          <p>Thêm người bạn nhỏ đầu tiên để chọn bé nhanh hơn khi đặt lịch.</p>
          <button className="account-primary" onClick={() => start(null)}>
            Thêm thú cưng đầu tiên
          </button>
        </section>
      ) : (
        <div className="pet-collection">
          {pets.map((p, i) => (
            <article className="pet-record" key={p.id}>
              <div
                className={`pet-record-portrait pet-record-portrait--${i % 2}`}
              >
                {p.imageUrl ? (
                  <img
                    className="pet-record-image"
                    src={p.imageUrl}
                    alt={p.name}
                  />
                ) : (
                  <span className="pet-monogram" aria-hidden="true">
                    {p.name.trim().slice(0, 1)}
                  </span>
                )}
                <span className="account-tag">{p.species}</span>
              </div>
              <div className="pet-record-body">
                <h2>{p.name}</h2>
                <p>
                  {p.breed || 'Chưa bổ sung giống'}
                  <span> · </span>
                  {p.weightKg} kg
                </p>
                <details>
                  <summary>Xem hồ sơ của bé</summary>
                  <dl className="account-data">
                    <div>
                      <dt>Loại thú cưng</dt>
                      <dd>{p.species}</dd>
                    </div>
                    <div>
                      <dt>Trạng thái</dt>
                      <dd>Đang hoạt động</dd>
                    </div>
                  </dl>
                </details>
                {removing === p.id ? (
                  <div className="pet-remove-confirm">
                    <p>Gỡ {p.name} khỏi danh sách? Lịch hẹn cũ vẫn được giữ.</p>
                    <button
                      className="account-secondary"
                      disabled={busy}
                      onClick={() => remove(p.id)}
                    >
                      {busy ? 'Đang gỡ…' : 'Xác nhận gỡ'}
                    </button>
                    <button
                      className="account-secondary"
                      disabled={busy}
                      onClick={() => setRemoving(null)}
                    >
                      Giữ lại bé
                    </button>
                  </div>
                ) : (
                  <div className="pet-record-actions">
                    <button
                      className="account-text-link"
                      disabled={!!editing}
                      onClick={() => start(p)}
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                    <button
                      className="account-text-link"
                      disabled={!!editing}
                      onClick={() => setRemoving(p.id)}
                    >
                      Gỡ thú cưng
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <div className="pets-booking-link">
        <p>Hồ sơ đã sẵn sàng cho cuộc hẹn tiếp theo.</p>
        <Link className="account-text-link" to="/booking">
          Đặt lịch chăm sóc →
        </Link>
      </div>
    </div>
  )
}
