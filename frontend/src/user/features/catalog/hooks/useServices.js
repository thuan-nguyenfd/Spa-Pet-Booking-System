import { useCallback, useEffect, useState } from 'react'
import { serviceService } from '../services/serviceService.js'

export function useServices(id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    const request =
      id === undefined
        ? serviceService.getAvailableServices()
        : serviceService.getServiceById(id)
    request
      .then((result) => {
        if (active) setData(result)
      })
      .catch(() => {
        if (active) setError('Chưa tải được dịch vụ. Bạn thử lại nhé.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, attempt])
  return { data, loading, error, retry }
}
