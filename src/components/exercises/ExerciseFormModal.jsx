import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

const emptyForm = { name: '', category: '', videoUrl: '' }

export default function ExerciseFormModal({ open, exercise, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      exercise
        ? {
            name: exercise.name || '',
            category: exercise.category || '',
            videoUrl: exercise.videoUrl || '',
          }
        : emptyForm
    )
    setError('')
  }, [open, exercise])

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
      setError(err.message || 'No se pudo guardar el ejercicio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={exercise ? 'Editar ejercicio' : 'Nuevo ejercicio'} onClose={onClose}>
      <form className="exercise-form" onSubmit={handleSubmit}>
        <Alert variant="error">{error}</Alert>
        <Input label="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <Input
          label="Categoría"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Pecho, Espalda, Piernas..."
        />
        <Input
          label="URL del vídeo"
          name="videoUrl"
          type="url"
          value={form.videoUrl}
          onChange={handleChange}
          placeholder="https://..."
        />
        <div className="exercise-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {exercise ? 'Guardar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}