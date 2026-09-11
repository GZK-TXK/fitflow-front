import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

const emptyForm = { title: '', description: '', clientId: '' }

export default function WorkoutFormModal({ open, workout, clients, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      workout
        ? {
            title: workout.title || '',
            description: workout.description || '',
            clientId: workout.clientId || '',
          }
        : emptyForm
    )
    setError('')
  }, [open, workout])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.clientId) {
      setError('Selecciona un cliente')
      return
    }
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo guardar la rutina')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={workout ? 'Editar rutina' : 'Nueva rutina'} onClose={onClose}>
      <form className="workout-form" onSubmit={handleSubmit}>
        <Alert variant="error">{error}</Alert>
        <Input label="Título" name="title" value={form.title} onChange={handleChange} required />
        <label className="ui-field">
          <span className="ui-field__label">Cliente</span>
          <select
            className="ui-input"
            name="clientId"
            value={form.clientId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="ui-field">
          <span className="ui-field__label">Descripción</span>
          <textarea
            className="ui-input"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <div className="workout-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {workout ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}