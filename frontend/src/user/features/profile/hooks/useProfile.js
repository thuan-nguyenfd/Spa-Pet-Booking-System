import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/providers/AuthProvider.jsx'
import { profileService } from '../services/profileService.js'
export function useProfile() {
  const { setUser } = useAuth()
  const [profile, setProfile] = useState(null),
    [form, setForm] = useState({ fullName: '', phone: '' }),
    [editing, setEditing] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(''),
    [error, setError] = useState('')
  useEffect(() => {
    profileService
      .getProfile()
      .then((p) => {
        setProfile(p)
        setForm(p)
      })
      .catch((e) => setError(e.message))
  }, [])
  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const p = await profileService.updateProfile(form)
      setProfile(p)
      setUser(p)
      setForm(p)
      setEditing(false)
      setMessage('Đã cập nhật thông tin của bạn.')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return {
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
  }
}
