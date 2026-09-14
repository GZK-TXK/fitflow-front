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

export function useUsers(role = '') {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const query = role ? `?role=${role}` : ''
      const data = await api.get(`/api/admin/users${query}`)
      setUsers(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [role])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const updateStatus = useCallback(async (id, status) => {
    const updated = await api.put(`/api/admin/users/${id}/status`, { status })
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: updated.status } : u)))
    return updated
  }, [])

  const updateRole = useCallback(async (id, roleValue) => {
    const updated = await api.put(`/api/admin/trainers/${id}/role`, { role: roleValue })
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)))
    return updated
  }, [])

  const deleteUser = useCallback(async (id) => {
    await api.delete(`/api/admin/trainers/${id}`)
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  return { users, loading, error, loadUsers, updateStatus, updateRole, deleteUser }
}