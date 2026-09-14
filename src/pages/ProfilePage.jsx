import { useEffect, useState } from 'react'
import { api } from '../lib/apiClient.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/profile.scss'

export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    api
      .get('/api/profile')
      .then((data) => {
        if (active) setForm({ name: data.name || '', phone: data.phone || '' })
      })
      .catch((err) => {
        if (active) setError(err.message || 'No se pudo cargar el perfil')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await api.put('/api/profile', form)
      setSuccess('Perfil actualizado correctamente')
    } catch (err) {
      setError(err.message || 'No se pudo guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="profile">
      <PageHeader title="Mi perfil" subtitle="Datos que verán tus clientes" />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      {loading ? (
        <Spinner label="Cargando perfil..." />
      ) : (
        <form className="profile__form" onSubmit={handleSubmit}>
          <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
          <Input
            label="Teléfono"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+34 600 000 000"
          />
          <p className="profile__email">Email: {user?.email}</p>
          <div className="profile__actions">
            <Button type="submit" loading={saving}>Guardar</Button>
          </div>
        </form>
      )}
    </section>
  )
}