import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useWorkouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWorkouts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/workouts')
      setWorkouts(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las rutinas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts])

  const createWorkout = useCallback(async (payload) => {
    const created = await api.post('/api/workouts', payload)
    setWorkouts((prev) => [created, ...prev])
    return created
  }, [])

  const updateWorkout = useCallback(async (id, payload) => {
    const updated = await api.put(`/api/workouts/${id}`, payload)
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)))
    return updated
  }, [])

  const deleteWorkout = useCallback(async (id) => {
    await api.delete(`/api/workouts/${id}`)
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
  }, [])

  return { workouts, loading, error, loadWorkouts, createWorkout, updateWorkout, deleteWorkout }
}

export function useWorkout(id) {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWorkout = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get(`/api/workouts/${id}`)
      setWorkout(data)
    } catch (err) {
      setError(err.message || 'No se pudo cargar la rutina')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadWorkout()
  }, [loadWorkout])

  const addItem = useCallback(
    async (payload) => {
      const created = await api.post(`/api/workouts/${id}/items`, payload)
      setWorkout((prev) =>
        prev ? { ...prev, items: [...(prev.items || []), created] } : prev
      )
      return created
    },
    [id]
  )

  const updateItem = useCallback(
    async (itemId, payload) => {
      const updated = await api.put(`/api/workouts/${id}/items/${itemId}`, payload)
      setWorkout((prev) =>
        prev
          ? { ...prev, items: prev.items.map((it) => (it.id === itemId ? updated : it)) }
          : prev
      )
      return updated
    },
    [id]
  )

  const deleteItem = useCallback(
    async (itemId) => {
      await api.delete(`/api/workouts/${id}/items/${itemId}`)
      setWorkout((prev) =>
        prev ? { ...prev, items: prev.items.filter((it) => it.id !== itemId) } : prev
      )
    },
    [id]
  )

  return { workout, loading, error, loadWorkout, addItem, updateItem, deleteItem }
}