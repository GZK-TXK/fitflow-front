
import { Link } from 'react-router-dom'
import { useClients } from '../hooks/useClients.js'
import { useExercises } from '../hooks/useExercises.js'
import { useWorkouts } from '../hooks/useWorkouts.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import '../styles/dashboard.scss'

export default function DashboardPage() {
  const { clients, loading: loadingClients, error: clientsError } = useClients()
  const { exercises, loading: loadingExercises, error: exercisesError } = useExercises()
  const { workouts, loading: loadingWorkouts, error: workoutsError } = useWorkouts()

  const loading = loadingClients || loadingExercises || loadingWorkouts
  const error = clientsError || exercisesError || workoutsError

  return (
    <section className="dashboard">
      <h1>Dashboard</h1>

      <Alert variant="error">{error}</Alert>

      {loading ? (
        <Spinner label="Cargando resumen..." />
      ) : (
        <>
          <div className="dashboard__stats">
            <Link to="/clients" className="dashboard__stat">
              <span className="dashboard__stat-value">{clients.length}</span>
              <span className="dashboard__stat-label">Clientes</span>
            </Link>
            <Link to="/exercises" className="dashboard__stat">
              <span className="dashboard__stat-value">{exercises.length}</span>
              <span className="dashboard__stat-label">Ejercicios</span>
            </Link>
            <Link to="/workouts" className="dashboard__stat">
              <span className="dashboard__stat-value">{workouts.length}</span>
              <span className="dashboard__stat-label">Rutinas</span>
            </Link>
          </div>

          <div className="dashboard__recent">
            <h2 className="dashboard__subtitle">Últimos clientes</h2>
            {clients.length === 0 ? (
              <p className="dashboard__empty">Aún no tienes clientes.</p>
            ) : (
              <ul className="dashboard__list">
                {clients.slice(0, 5).map((client) => (
                  <li key={client.id} className="dashboard__list-item">
                    <Link to={`/clients/${client.id}`}>{client.name}</Link>
                    <span className="dashboard__list-meta">{client.email || 'Sin email'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  )
}