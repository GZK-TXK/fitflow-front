import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

const emptyForm = { exerciseId: '', sets: 3, reps: 10, weight: '', restTime: 60, order: 0 }

export default function WorkoutItemFormModal({ open, item, exercises, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm(
      item
        ? {
            exerciseId: item.exerciseId || '',
            sets: item.sets ?? 3,
            reps: item.reps ?? 10,
            weight: item.weight ?? '',
            restTime: item.restTime ?? 60,
            order: item.order ?? 0,
          }
        : emptyForm
    )
    setError('')
  }, [open, item])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!item && !form.exerciseId) {
      setError('Selecciona un ejercicio')
      return
    }
    setSaving(true)
    try {
      const payload = {
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: form.weight === '' ? null : Number(form.weight),
        restTime: Number(form.restTime),
        order: Number(form.order),
      }
      if (!item) payload.exerciseId = form.exerciseId
      await onSubmit(payload)
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo guardar el ejercicio de la rutina')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={item ? 'Editar ejercicio' : 'Añadir ejercicio'} onClose={onClose}>
      <form className="workout-item-form" onSubmit={handleSubmit}>
        <Alert variant="error">{error}</Alert>

        {!item && (
          <label className="ui-field">
            <span className="ui-field__label">Ejercicio</span>
            <select
              className="ui-input"
              name="exerciseId"
              value={form.exerciseId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un ejercicio</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="workout-item-form__row">
          <Input label="Series" name="sets" type="number" min="1" value={form.sets} onChange={handleChange} />
          <Input label="Repeticiones" name="reps" type="number" min="1" value={form.reps} onChange={handleChange} />
        </div>

        <div className="workout-item-form__row">
          <Input label="Peso (kg)" name="weight" type="number" min="0" step="0.5" value={form.weight} onChange={handleChange} />
          <Input label="Descanso (s)" name="restTime" type="number" min="0" value={form.restTime} onChange={handleChange} />
        </div>

        <Input label="Orden" name="order" type="number" min="0" value={form.order} onChange={handleChange} />

        <div className="workout-item-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {item ? 'Guardar' : 'Añadir'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}