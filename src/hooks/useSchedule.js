import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useClientSchedule(clientId) {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!clientId) {
      setSchedule([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await api.get(`/api/schedule?clientId=${clientId}`)
      setSchedule(data)
    } catch (err) {
      setError(err.message || 'No se pudo cargar el calendario')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    load()
  }, [load])

  const add = useCallback(
    async (payload) => {
      const created = await api.post('/api/schedule', { ...payload, clientId })
      setSchedule((prev) =>
        [...prev, created].sort((a, b) => new Date(a.date) - new Date(b.date))
      )
      return created
    },
    [clientId]
  )

  const remove = useCallback(async (id) => {
    await api.delete(`/api/schedule/${id}`)
    setSchedule((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { schedule, loading, error, add, remove, reload: load }
}

export function useMySchedule() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .get('/api/me/schedule')
      .then((data) => {
        if (active) setSchedule(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar tu calendario')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { schedule, loading, error }
}