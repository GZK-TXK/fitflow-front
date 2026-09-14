import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { useClient } from '../hooks/useClients.js'
import { api } from '../lib/apiClient.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import Button from '../components/ui/Button.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import '../styles/clients.scss'

export default function ClientDetailPage() {
  const { id } = useParams()
  const { client, loading, error, reloadClient } = useClient(id)

  const [accessError, setAccessError] = useState('')
  const [accessMessage, setAccessMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirmRevoke, setConfirmRevoke] = useState(false)

  const grantAccess = async () => {
    setBusy(true)
    setAccessError('')
    setAccessMessage('')
    try {
      const data = await api.post(`/api/clients/${id}/invite`)
      setAccessMessage(data.message || 'Acceso concedido')
      await reloadClient()
    } catch (err) {
      setAccessError(err.message || 'No se pudo dar acceso')
    } finally {
      setBusy(false)
    }
  }

  const revokeAccess = async () => {
    setBusy(true)
    setAccessError('')
    setAccessMessage('')
    try {
      await api.delete(`/api/clients/${id}/invite`)
      setAccessMessage('Acceso revocado')
      setConfirmRevoke(false)
      await reloadClient()
    } catch (err) {
      setAccessError(err.message || 'No se pudo revocar el acceso')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Spinner label="Cargando cliente..." />

  const hasAccess = Boolean(client?.accountUserId)

  return (
    <section className="client-detail">
      <Link to="/clients" className="client-detail__back">← Volver a clientes</Link>

      <Alert variant="error">{error}</Alert>

      {client && (
        <>
          <PageHeader
            title={client.name}
            subtitle={[client.email || 'Sin email', client.phone].filter(Boolean).join(' · ')}
            actions={
              hasAccess ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setConfirmRevoke(true)}
                  disabled={busy}
                >
                  Quitar acceso
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={grantAccess}
                  loading={busy}
                  disabled={!client.email}
                >
                  Dar acceso
                </Button>
              )
            }
          />

          {client.notes && <p className="client-detail__notes">{client.notes}</p>}

          <div className="client-access">
            <div className="client-access__info">
              <span className="client-access__title">Acceso al portal</span>
              <span
                className={`client-access__status${
                  hasAccess ? ' client-access__status--on' : ''
                }`}
              >
                {hasAccess
                  ? `Con acceso${client.account?.email ? ` (${client.account.email})` : ''}`
                  : 'Sin acceso'}
              </span>
            </div>
          </div>

          {!client.email && !hasAccess && (
            <p className="client-detail__meta">
              Añade un email al cliente para poder darle acceso.
            </p>
          )}

          <Alert variant="error">{accessError}</Alert>
          <Alert variant="success">{accessMessage}</Alert>

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
            <EmptyState icon={<Dumbbell size={32} />} message="Este cliente aún no tiene rutinas." />
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmRevoke}
        title="Quitar acceso"
        message={`¿Quitar el acceso al portal a ${client?.name}?`}
        confirmLabel="Quitar acceso"
        loading={busy}
        onConfirm={revokeAccess}
        onCancel={() => setConfirmRevoke(false)}
      />
    </section>
  )
}