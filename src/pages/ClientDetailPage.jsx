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
import InviteModal from '../components/invitations/InviteModal.jsx'
import '../styles/clients.scss'

export default function ClientDetailPage() {
  const { id } = useParams()
  const { client, loading, error, reloadClient } = useClient(id)

  const [accessError, setAccessError] = useState('')
  const [accessMessage, setAccessMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const setAccess = async (status) => {
    setBusy(true)
    setAccessError('')
    setAccessMessage('')
    try {
      const data = await api.put(`/api/clients/${id}/access`, { status })
      setAccessMessage(data.message || 'Actualizado')
      await reloadClient()
    } catch (err) {
      setAccessError(err.message || 'No se pudo actualizar el acceso')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <Spinner label="Cargando cliente..." />

  const hasAccount = Boolean(client?.accountUserId)
  const accountStatus = client?.account?.status

  let statusLabel = 'Sin registrar'
  let statusModifier = 'client-access__status--off'
  if (hasAccount && accountStatus === 'ACTIVE') {
    statusLabel = `Con acceso${client.account?.email ? ` (${client.account.email})` : ''}`
    statusModifier = 'client-access__status--on'
  } else if (hasAccount && accountStatus === 'PENDING') {
    statusLabel = 'Pendiente de acceso'
    statusModifier = 'client-access__status--pending'
  } else if (hasAccount && accountStatus === 'DISABLED') {
    statusLabel = 'Acceso revocado'
    statusModifier = 'client-access__status--off'
  }

  return (
    <section className="client-detail">
      <Link to="/clients" className="client-detail__back">← Volver a clientes</Link>

      <Alert variant="error">{error}</Alert>

      {client && (
        <>
          <PageHeader
            title={client.name}
            subtitle={[client.email || 'Sin email', client.phone].filter(Boolean).join(' · ')}
          />

          {client.notes && <p className="client-detail__notes">{client.notes}</p>}

          <div className="client-access">
            <div className="client-access__info">
              <span className="client-access__title">Acceso al portal</span>
              <span className={`client-access__status ${statusModifier}`}>{statusLabel}</span>
            </div>
            <div className="client-access__actions">
              {!hasAccount && (
                <Button
                  size="sm"
                  onClick={() => setInviteOpen(true)}
                  disabled={!client.email}
                >
                  Generar enlace de invitación
                </Button>
              )}
              {hasAccount && accountStatus !== 'ACTIVE' && (
                <Button size="sm" onClick={() => setAccess('ACTIVE')} loading={busy}>
                  Dar acceso
                </Button>
              )}
              {hasAccount && accountStatus === 'ACTIVE' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setAccess('DISABLED')}
                  disabled={busy}
                >
                  Quitar acceso
                </Button>
              )}
            </div>
          </div>

          {!client.email && !hasAccount && (
            <p className="client-detail__meta">
              Añade un email al cliente para poder invitarlo.
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

      <InviteModal
        open={inviteOpen}
        type="CLIENT"
        title="Invitar cliente"
        fixedEmail={client?.email || ''}
        onClose={() => setInviteOpen(false)}
      />
    </section>
  )
}