import { useEffect, useState } from 'react'
import { petService, validatePet } from '../services/petService.js'
const blank = () => ({
  name: '',
  type: 'DOG',
  breed: '',
  weightKg: '',
  imageUrl: '',
})
export function usePets() {
  const [pets, setPets] = useState([]),
    [loading, setLoading] = useState(true),
    [editing, setEditing] = useState(null),
    [form, setForm] = useState(blank),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [removing, setRemoving] = useState(null)
  async function load() {
    try {
      setPets(await petService.getMyPets())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  function start(pet) {
    setEditing(pet?.id || 'new')
    setForm(
      pet
        ? {
            ...pet,
            type: pet.type || (pet.species === 'Mèo' ? 'CAT' : 'DOG'),
            breed: pet.breed || '',
          }
        : blank(),
    )
    setError('')
    setMessage('')
    setRemoving(null)
  }
  async function save(e) {
    e.preventDefault()
    const validation = validatePet(form)
    if (validation) return setError(validation)
    setBusy(true)
    setError('')
    try {
      if (editing === 'new') await petService.createPet(form)
      else await petService.updatePet(editing, form)
      await load()
      setEditing(null)
      setMessage('Đã lưu hồ sơ thú cưng. Bạn có thể chọn bé khi đặt lịch.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  async function remove(id) {
    setBusy(true)
    setError('')
    try {
      await petService.deletePet(id)
      await load()
      setRemoving(null)
      setMessage(
        'Đã gỡ thú cưng khỏi danh sách. Các lịch hẹn cũ vẫn được giữ nguyên.',
      )
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  async function image(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (
      !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
      file.size > 2 * 1024 * 1024
    ) {
      setError('Bạn chọn ảnh JPG, PNG hoặc WebP dưới 2 MB nhé.')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setForm((v) => ({ ...v, imageUrl: String(reader.result) }))
      setError('')
    }
    reader.onerror = () =>
      setError('Không thể đọc ảnh này. Bạn chọn ảnh khác nhé.')
    reader.readAsDataURL(file)
  }
  return {
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
  }
}
