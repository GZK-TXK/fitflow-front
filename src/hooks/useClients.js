import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadClients = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/api/clients')
      setClients(data)
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const createClient = useCallback(async (payload) => {
    const created = await api.post('/api/clients', payload)
    setClients((prev) => [created, ...prev])
    return created
  }, [])

  const updateClient = useCallback(async (id, payload) => {
    const updated = await api.put(`/api/clients/${id}`, payload)
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)))
    return updated
  }, [])

  const deleteClient = useCallback(async (id) => {
    await api.delete(`/api/clients/${id}`)
    setClients((prev) => prev.filter((c) => c.id !== id))
  }, [])

  return { clients, loading, error, loadClients, createClient, updateClient, deleteClient }
}

export function useClient(id) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    api
      .get(`/api/clients/${id}`)
      .then((data) => {
        if (active) setClient(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar el cliente')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id])

  return { client, loading, error }
}