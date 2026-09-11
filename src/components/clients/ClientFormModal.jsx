import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

const emptyForm = { name: '', email: '', phone: '', notes: '' }

export default function ClientFormModal({ open, client, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      client
        ? {
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            notes: client.notes || '',
          }
        : emptyForm
    )
    setError('')
  }, [open, client])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el cliente')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={client ? 'Editar cliente' : 'Nuevo cliente'} onClose={onClose}>
      <form className="client-form" onSubmit={handleSubmit}>
        <Alert variant="error">{error}</Alert>
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
        <Input label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
        <label className="ui-field">
          <span className="ui-field__label">Notas</span>
          <textarea
            className="ui-input"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
          />
        </label>
        <div className="client-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {client ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
} 