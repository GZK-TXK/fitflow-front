import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useAdminStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .get('/api/admin/stats')
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudieron cargar las estadísticas')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { stats, loading, error }
}

export function useTrainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTrainers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/admin/trainers')
      setTrainers(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los entrenadores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrainers()
  }, [loadTrainers])

  const updateRole = useCallback(async (id, role) => {
    const updated = await api.put(`/api/admin/trainers/${id}/role`, { role })
    setTrainers((prev) => prev.map((t) => (t.id === id ? { ...t, role: updated.role } : t)))
    return updated
  }, [])

  const deleteTrainer = useCallback(async (id) => {
    await api.delete(`/api/admin/trainers/${id}`)
    setTrainers((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { trainers, loading, error, loadTrainers, updateRole, deleteTrainer }
}