import { Link } from 'react-router-dom'
import { useAdminStats } from '../hooks/useAdmin.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import '../styles/admin.scss'

export default function AdminDashboardPage() {
  const { stats, loading, error } = useAdminStats()

  return (
    <section className="admin">
      <PageHeader title="Panel de administración" subtitle="Resumen de la plataforma" />

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
          <div className="admin__stat admin__stat--warning">
            <span className="admin__stat-value">{stats.pending}</span>
            <span className="admin__stat-label">Pendientes</span>
          </div>
        </div>
      ) : null}

      <div className="admin__links">
        <Link to="/admin/users" className="admin__link">
          Gestionar usuarios
        </Link>
        <Link to="/admin/subscriptions" className="admin__link">
          Suscripciones
        </Link>
      </div>
    </section>
  )
}