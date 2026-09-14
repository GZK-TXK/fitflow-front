import { useEffect, useState } from 'react'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

export default function AssignmentModal({ open, date, workouts, onClose, onSubmit }) {
  const [workoutId, setWorkoutId] = useState('')
  const [time, setTime] = useState('10:00')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setWorkoutId('')
    setTime('10:00')
    setNotes('')
    setError('')
  }, [open])

  const dateLabel = date
    ? date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    : ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!workoutId) {
      setError('Selecciona una rutina')
      return
    }

    const [hours, minutes] = time.split(':').map(Number)
    const when = new Date(date)
    when.setHours(hours, minutes, 0, 0)

    setSaving(true)
    try {
      await onSubmit({ workoutId, date: when.toISOString(), notes })
      onClose()
    } catch (err) {
      setError(err.message || 'No se pudo asignar la rutina')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} title={`Asignar rutina · ${dateLabel}`} onClose={onClose}>
      <form className="assign-form" onSubmit={handleSubmit}>
        <Alert variant="error">{error}</Alert>

        <label className="ui-field">
          <span className="ui-field__label">Rutina</span>
          <select
            className="ui-input"
            value={workoutId}
            onChange={(event) => setWorkoutId(event.target.value)}
            required
          >
            <option value="">Selecciona una rutina</option>
            {workouts.map((workout) => (
              <option key={workout.id} value={workout.id}>
                {workout.title}
              </option>
            ))}
          </select>
        </label>

        <Input label="Hora" name="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <Input label="Notas" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <div className="assign-form__actions">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Asignar
          </Button>
        </div>
      </form>
    </Modal>
  )
}