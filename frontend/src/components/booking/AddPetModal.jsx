import { useEffect, useRef, useState } from 'react'
import PetAvatar from './PetAvatar.jsx'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Không thể đọc ảnh này.'))
    reader.readAsDataURL(file)
  })
}

export default function AddPetModal({ onClose, onSave }) {
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const [form, setForm] = useState({ name: '', species: 'Chó', breed: '', weightKg: '', imageUrl: '' })
  const [imageName, setImageName] = useState('')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previouslyFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const focusable = [...(dialogRef.current?.querySelectorAll('button, input, select, textarea, [href]') ?? [])]
        .filter((element) => !element.disabled)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn một tệp hình ảnh.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Ảnh nên có dung lượng dưới 2 MB.')
      event.target.value = ''
      return
    }
    try {
      const imageUrl = await readImage(file)
      setForm((current) => ({ ...current, imageUrl }))
      setImageName(file.name)
      setError('')
    } catch {
      setError('Không thể đọc ảnh này. Bạn thử chọn ảnh khác nhé.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const weight = Number(form.weightKg)
    if (!form.name.trim()) return setError('Bạn nhập tên của bé giúp mình nhé.')
    if (!form.species) return setError('Bạn chọn loại thú cưng nhé.')
    if (!Number.isFinite(weight) || weight <= 0 || weight > 100) {
      return setError('Cân nặng cần lớn hơn 0 và không quá 100 kg.')
    }

    setIsSaving(true)
    try {
      await onSave({ ...form, weightKg: weight })
    } catch {
      setError('Chưa lưu được hồ sơ. Bạn thử lại nhé.')
      setIsSaving(false)
    }
  }

  return (
    <div className="booking-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="add-pet-title" ref={dialogRef}>
        <header className="booking-modal__header">
          <div>
            <p className="booking-step-heading__eyebrow">HỒ SƠ THÚ CƯNG</p>
            <h2 id="add-pet-title">Thêm thành viên mới</h2>
            <p>Cho tụi mình biết một chút về bé nhé.</p>
          </div>
          <button className="booking-modal__close" type="button" aria-label="Đóng" onClick={onClose}>×</button>
        </header>

        <form className="booking-pet-form" onSubmit={handleSubmit} noValidate>
          <div className="booking-pet-form__photo">
            <PetAvatar pet={{ species: form.species, imageUrl: form.imageUrl }} />
            <label className="booking-photo-upload">
              <input type="file" accept="image/*" onChange={handlePhoto} />
              <span className="booking-photo-upload__choose">Thêm ảnh (không bắt buộc)</span>
              <span className="booking-photo-upload__name">{imageName || 'JPG hoặc PNG · tối đa 2 MB'}</span>
            </label>
          </div>

          <label className="booking-field">
            <span>Tên thú cưng <b aria-hidden="true">*</b></span>
            <input ref={firstFieldRef} name="name" value={form.name} onChange={updateField} maxLength={60} autoComplete="off" placeholder="Ví dụ: Mochi" required />
          </label>

          <div className="booking-form-row">
            <label className="booking-field">
              <span>Loại thú cưng <b aria-hidden="true">*</b></span>
              <select name="species" value={form.species} onChange={updateField} required>
                <option value="Chó">Chó</option>
                <option value="Mèo">Mèo</option>
              </select>
            </label>
            <label className="booking-field">
              <span>Cân nặng (kg) <b aria-hidden="true">*</b></span>
              <input name="weightKg" type="number" min="0.1" max="100" step="0.1" value={form.weightKg} onChange={updateField} placeholder="4.5" required />
            </label>
          </div>

          <label className="booking-field">
            <span>Giống</span>
            <input name="breed" value={form.breed} onChange={updateField} maxLength={80} placeholder="Ví dụ: Poodle, mèo mướp" />
          </label>

          {error && <p className="booking-inline-error" role="alert">{error}</p>}
          <div className="booking-modal__actions">
            <button className="booking-text-button" type="button" onClick={onClose} disabled={isSaving}>Để sau</button>
            <button className="button button--primary booking-action-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Đang lưu…' : 'Lưu hồ sơ'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
