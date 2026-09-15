import { useMemo, useState } from 'react'
import { Dumbbell } from 'lucide-react'
import { useExercises } from '../hooks/useExercises.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import VideoModal from '../components/ui/VideoModal.jsx'
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
  const [videoExercise, setVideoExercise] = useState(null)

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
      <PageHeader
        title="Ejercicios"
        actions={<Button onClick={openCreate}>Nuevo ejercicio</Button>}
      />

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
            <EmptyState
              icon={<Dumbbell size={32} />}
              message="No hay ejercicios en esta categoría."
            />
          ) : (
            <div className="exercises__grid">
              {visible.map((exercise) => (
                <article key={exercise.id} className="exercises__card">
                  <h3 className="exercises__name">{exercise.name}</h3>
                  {exercise.category && (
                    <span className="exercises__category">{exercise.category}</span>
                  )}
                  {exercise.videoUrl && (
                    <button
                      type="button"
                      className="exercises__video"
                      onClick={() => setVideoExercise(exercise)}
                    >
                      Ver vídeo
                    </button>
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

      <VideoModal
        open={Boolean(videoExercise)}
        url={videoExercise?.videoUrl}
        title={videoExercise?.name}
        onClose={() => setVideoExercise(null)}
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