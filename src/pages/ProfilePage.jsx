import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/apiClient.js'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/profile.scss'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({ name: '', phone: '' })
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let active = true
    api
      .get('/api/profile')
      .then((data) => {
        if (!active) return
        setForm({ name: data.name || '', phone: data.phone || '' })
        setAvatarUrl(data.avatarUrl || null)
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
      const updated = await api.put('/api/profile', form)
      updateUser({ name: updated.name, phone: updated.phone })
      setSuccess('Perfil actualizado correctamente')
    } catch (err) {
      setError(err.message || 'No se pudo guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatar = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setSuccess('')
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const updated = await api.upload('/api/profile/avatar', formData)
      setAvatarUrl(updated.avatarUrl)
      updateUser({ avatarUrl: updated.avatarUrl })
      setSuccess('Foto actualizada')
    } catch (err) {
      setError(err.message || 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const subtitle =
    user?.role === 'CLIENT' ? 'Tu foto y tus datos' : 'Datos que verán tus clientes'

  return (
    <section className="profile">
      <PageHeader title="Mi perfil" subtitle={subtitle} />

      <Alert variant="error">{error}</Alert>
      <Alert variant="success">{success}</Alert>

      {loading ? (
        <Spinner label="Cargando perfil..." />
      ) : (
        <>
          <div className="profile__avatar">
            <Avatar user={{ name: form.name, email: user?.email, avatarUrl }} size={72} />
            <div className="profile__avatar-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatar}
                hidden
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
              >
                Cambiar foto
              </Button>
            </div>
          </div>

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
        </>
      )}
    </section>
  )
}