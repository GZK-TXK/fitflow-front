import { Link, useParams } from 'react-router-dom'
import { useMyWorkout } from '../hooks/useMe.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import '../styles/portal.scss'

export default function ClientWorkoutDetailPage() {
  const { id } = useParams()
  const { workout, loading, error } = useMyWorkout(id)

  if (loading) return <Spinner label="Cargando rutina..." />

  return (
    <section className="portal">
      <Link to="/portal" className="portal__back">← Volver a mis rutinas</Link>

      <Alert variant="error">{error}</Alert>

      {workout && (
        <>
          <PageHeader title={workout.title} subtitle={workout.description} />

          {workout.items?.length ? (
            <ul className="portal__exercises">
              {workout.items.map((item) => (
                <li key={item.id} className="portal__exercise">
                  <div className="portal__exercise-info">
                    <span className="portal__exercise-name">{item.exercise?.name}</span>
                    {item.exercise?.category && (
                      <span className="portal__exercise-category">
                        {item.exercise.category}
                      </span>
                    )}
                    <span className="portal__exercise-meta">
                      {item.sets ?? '-'} series × {item.reps ?? '-'} reps
                      {item.weight != null ? ` · ${item.weight} kg` : ''}
                      {item.restTime != null ? ` · ${item.restTime}s descanso` : ''}
                    </span>
                  </div>
                  {item.exercise?.videoUrl && (
                    <a
                      className="portal__exercise-video"
                      href={item.exercise.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver vídeo
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState message="Esta rutina aún no tiene ejercicios." />
          )}
        </>
      )}
    </section>
  )
}