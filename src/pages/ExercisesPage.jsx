import { useMemo, useState } from 'react'
import { useExercises } from '../hooks/useExercises.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import ExerciseFormModal from '../components/exercises/ExerciseFormModal.jsx'
import '../styles/exercises.scss'

export default function ExercisesPage() {
  const { exercises, loading, error, createExercise, updateExercise, deleteExercise } =
    useExercises()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')
  const [category, setCategory] = useState('Todas')

  const categories = useMemo(() => {
    const unique = new Set(exercises.map((e) => e.category).filter(Boolean))
    return ['Todas', ...Array.from(unique).sort()]
  }, [exercises])

  const visible =
    category === 'Todas' ? exercises : exercises.filter((e) => e.category === category)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (exercise) => {
    setEditing(exercise)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateExercise(editing.id, payload)
    } else {
      await createExercise(payload)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await deleteExercise(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="exercises">
      <header className="exercises__header">
        <h1>Ejercicios</h1>
        <Button onClick={openCreate}>Nuevo ejercicio</Button>
      </header>

      <Alert variant="error">{error || actionError}</Alert>

      {loading ? (
        <Spinner label="Cargando ejercicios..." />
      ) : (
        <>
          <div className="exercises__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`exercises__filter${
                  cat === category ? ' exercises__filter--active' : ''
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="exercises__empty">No hay ejercicios en esta categoría.</p>
          ) : (
            <div className="exercises__grid">
              {visible.map((exercise) => (
                <article key={exercise.id} className="exercises__card">
                  <h3 className="exercises__name">{exercise.name}</h3>
                  {exercise.category && (
                    <span className="exercises__category">{exercise.category}</span>
                  )}
                  {exercise.videoUrl && (
                    <a
                      className="exercises__video"
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver vídeo
                    </a>
                  )}
                  <div className="exercises__actions">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(exercise)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setToDelete(exercise)}>
                      Eliminar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      <ExerciseFormModal
        open={formOpen}
        exercise={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar ejercicio"
        message={`¿Seguro que quieres eliminar "${toDelete?.name}"?`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}