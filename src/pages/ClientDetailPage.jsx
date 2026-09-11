import { Link, useParams } from 'react-router-dom'
import { useClient } from '../hooks/useClients.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import '../styles/clients.scss'

export default function ClientDetailPage() {
  const { id } = useParams()
  const { client, loading, error } = useClient(id)

  if (loading) return <Spinner label="Cargando cliente..." />

  return (
    <section className="client-detail">
      <Link to="/clients" className="client-detail__back">← Volver a clientes</Link>

      <Alert variant="error">{error}</Alert>

      {client && (
        <>
          <header className="client-detail__header">
            <h1>{client.name}</h1>
            <p className="client-detail__meta">{client.email || 'Sin email'}</p>
            <p className="client-detail__meta">{client.phone || 'Sin teléfono'}</p>
          </header>

          {client.notes && <p className="client-detail__notes">{client.notes}</p>}

          <h2 className="client-detail__subtitle">Rutinas</h2>
          {client.workouts?.length ? (
            <ul className="clients__list">
              {client.workouts.map((workout) => (
                <li key={workout.id} className="clients__item">
                  <span className="clients__name">{workout.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="clients__empty">Este cliente aún no tiene rutinas.</p>
          )}
        </>
      )}
    </section>
  )
}