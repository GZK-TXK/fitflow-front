import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { useWorkout } from '../hooks/useWorkouts.js'
import { useExercises } from '../hooks/useExercises.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import WorkoutItemFormModal from '../components/workouts/WorkoutItemFormModal.jsx'
import '../styles/workouts.scss'

export default function WorkoutBuilderPage() {
  const { id } = useParams()
  const { workout, loading, error, addItem, updateItem, deleteItem } = useWorkout(id)
  const { exercises } = useExercises()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateItem(editing.id, payload)
    } else {
      await addItem(payload)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await deleteItem(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner label="Cargando rutina..." />

  return (
    <section className="workout-builder">
      <Link to="/workouts" className="workout-builder__back">← Volver a rutinas</Link>

      <Alert variant="error">{error || actionError}</Alert>

      {workout && (
        <>
          <PageHeader
            title={workout.title}
            subtitle={[
              workout.client?.name ? `Cliente: ${workout.client.name}` : 'Sin cliente',
              workout.description,
            ]
              .filter(Boolean)
              .join(' · ')}
            actions={<Button onClick={openCreate}>Añadir ejercicio</Button>}
          />

          {workout.items?.length ? (
            <ul className="workout-builder__items">
              {workout.items.map((item) => (
                <li key={item.id} className="workout-builder__item">
                  <div className="workout-builder__item-info">
                    <span className="workout-builder__item-name">{item.exercise?.name}</span>
                    <span className="workout-builder__item-meta">
                      {item.sets ?? '-'} series × {item.reps ?? '-'} reps
                      {item.weight != null ? ` · ${item.weight} kg` : ''}
                      {item.restTime != null ? ` · ${item.restTime}s` : ''}
                    </span>
                  </div>
                  <div className="workout-builder__item-actions">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(item)}>
                      Quitar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<Dumbbell size={32} />}
              message="Esta rutina aún no tiene ejercicios."
              action={<Button onClick={openCreate}>Añadir ejercicio</Button>}
            />
          )}
        </>
      )}

      <WorkoutItemFormModal
        open={formOpen}
        item={editing}
        exercises={exercises}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Quitar ejercicio"
        message={`¿Quitar "${toDelete?.exercise?.name}" de la rutina?`}
        confirmLabel="Quitar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}