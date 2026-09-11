import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useExercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadExercises = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/exercises')
      setExercises(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los ejercicios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  const createExercise = useCallback(async (payload) => {
    const created = await api.post('/api/exercises', payload)
    setExercises((prev) => [created, ...prev])
    return created
  }, [])

  const updateExercise = useCallback(async (id, payload) => {
    const updated = await api.put(`/api/exercises/${id}`, payload)
    setExercises((prev) => prev.map((e) => (e.id === id ? updated : e)))
    return updated
  }, [])

  const deleteExercise = useCallback(async (id) => {
    await api.delete(`/api/exercises/${id}`)
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return {
    exercises,
    loading,
    error,
    loadExercises,
    createExercise,
    updateExercise,
    deleteExercise,
  }
}