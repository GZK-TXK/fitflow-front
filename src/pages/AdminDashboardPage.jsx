import { Link } from 'react-router-dom'
import { useAdminStats } from '../hooks/useAdmin.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import '../styles/admin.scss'

export default function AdminDashboardPage() {
  const { stats, loading, error } = useAdminStats()

  return (
    <section className="admin">
      <h1>Panel de administración</h1>

      <Alert variant="error">{error}</Alert>

      {loading ? (
        <Spinner label="Cargando estadísticas..." />
      ) : stats ? (
        <div className="admin__stats">
          <div className="admin__stat">
            <span className="admin__stat-value">{stats.trainers}</span>
            <span className="admin__stat-label">Entrenadores</span>
          </div>
          <div className="admin__stat">
            <span className="admin__stat-value">{stats.clients}</span>
            <span className="admin__stat-label">Clientes</span>
          </div>
          <div className="admin__stat">
            <span className="admin__stat-value">{stats.exercises}</span>
            <span className="admin__stat-label">Ejercicios</span>
          </div>
          <div className="admin__stat">
            <span className="admin__stat-value">{stats.workouts}</span>
            <span className="admin__stat-label">Rutinas</span>
          </div>
        </div>
      ) : null}

      <div className="admin__links">
        <Link to="/admin/trainers" className="admin__link">
          Gestionar entrenadores
        </Link>
        <Link to="/admin/subscriptions" className="admin__link">
          Suscripciones
        </Link>
      </div>
    </section>
  )
}