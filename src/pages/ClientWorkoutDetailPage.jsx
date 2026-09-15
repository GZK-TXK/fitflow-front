import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useMyProfile, useMyWorkouts } from '../hooks/useMe.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import '../styles/portal.scss'

export default function ClientWorkoutsPage() {
  const { profile, loading: loadingProfile, error: profileError } = useMyProfile()
  const { workouts, loading, error } = useMyWorkouts()

  if (profileError) {
    return (
      <section className="portal">
        <PageHeader title="Acceso pendiente" />
        <EmptyState message={profileError} />
      </section>
    )
  }

  return (
    <section className="portal">
      <PageHeader title="Mis rutinas" />

      <Alert variant="error">{error}</Alert>

      {!loadingProfile && profile && (
        <div className="portal__trainer">
          <div className="portal__trainer-row">
            <Avatar
              user={{ name: profile.trainer?.name, avatarUrl: profile.trainer?.avatarUrl }}
              size={48}
            />
            <div>
              <span className="portal__trainer-label">Tu entrenador</span>
              <span className="portal__trainer-name">{profile.trainer?.name}</span>
              <span className="portal__trainer-meta">
                {profile.trainer?.email}
                {profile.trainer?.phone ? ` · ${profile.trainer.phone}` : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <Spinner label="Cargando tus rutinas..." />
      ) : workouts.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={32} />}
          message="Aún no tienes rutinas asignadas."
        />
      ) : (
        <ul className="portal__list">
          {workouts.map((workout) => (
            <li key={workout.id} className="portal__item">
              <Link to={`/portal/workouts/${workout.id}`} className="portal__item-name">
                {workout.title}
              </Link>
              <span className="portal__item-meta">
                {workout.items?.length ?? 0} ejercicios
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}