import { useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useMyProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .get('/api/me/profile')
      .then((data) => {
        if (active) setProfile(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar tu perfil')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { profile, loading, error }
}

export function useMyWorkouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .get('/api/me/workouts')
      .then((data) => {
        if (active) setWorkouts(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudieron cargar tus rutinas')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { workouts, loading, error }
}

export function useMyWorkout(id) {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    api
      .get(`/api/me/workouts/${id}`)
      .then((data) => {
        if (active) setWorkout(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar la rutina')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  return { workout, loading, error }
}