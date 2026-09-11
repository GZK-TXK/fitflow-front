import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWorkouts } from '../hooks/useWorkouts.js'
import { useClients } from '../hooks/useClients.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import WorkoutFormModal from '../components/workouts/WorkoutFormModal.jsx'
import '../styles/workouts.scss'

export default function WorkoutsPage() {
  const { workouts, loading, error, createWorkout, updateWorkout, deleteWorkout } = useWorkouts()
  const { clients } = useClients()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (workout) => {
    setEditing(workout)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateWorkout(editing.id, payload)
    } else {
      await createWorkout(payload)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await deleteWorkout(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="workouts">
      <header className="workouts__header">
        <h1>Rutinas</h1>
        <Button onClick={openCreate}>Nueva rutina</Button>
      </header>

      <Alert variant="error">{error || actionError}</Alert>

      {loading ? (
        <Spinner label="Cargando rutinas..." />
      ) : workouts.length === 0 ? (
        <p className="workouts__empty">Todavía no tienes rutinas. Crea la primera.</p>
      ) : (
        <ul className="workouts__list">
          {workouts.map((workout) => (
            <li key={workout.id} className="workouts__item">
              <div className="workouts__info">
                <Link to={`/workouts/${workout.id}`} className="workouts__name">
                  {workout.title}
                </Link>
                <span className="workouts__meta">
                  {workout.client?.name ? `Cliente: ${workout.client.name}` : 'Sin cliente'} ·{' '}
                  {workout.items?.length ?? 0} ejercicios
                </span>
              </div>
              <div className="workouts__actions">
                <Button size="sm" variant="ghost" onClick={() => openEdit(workout)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => setToDelete(workout)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <WorkoutFormModal
        open={formOpen}
        workout={editing}
        clients={clients}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar rutina"
        message={`¿Seguro que quieres eliminar "${toDelete?.title}"?`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}