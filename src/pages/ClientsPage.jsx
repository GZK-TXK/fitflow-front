import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { useClients } from '../hooks/useClients.js'
import { usePresence } from '../hooks/usePresence.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import ClientFormModal from '../components/clients/ClientFormModal.jsx'
import '../styles/clients.scss'

export default function ClientsPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()
  const { isOnline } = usePresence()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (client) => {
    setEditing(client)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateClient(editing.id, payload)
    } else {
      await createClient(payload)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await deleteClient(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="clients">
      <PageHeader
        title="Clientes"
        actions={<Button onClick={openCreate}>Nuevo cliente</Button>}
      />

      <Alert variant="error">{error || actionError}</Alert>

      {loading ? (
        <Spinner label="Cargando clientes..." />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<Users size={32} />}
          title="Sin clientes"
          message="Todavía no tienes clientes. Crea el primero."
          action={<Button onClick={openCreate}>Nuevo cliente</Button>}
        />
      ) : (
        <ul className="clients__list">
          {clients.map((client) => (
            <li key={client.id} className="clients__item">
              <div className="clients__info">
                <span className="clients__name-row">
                  <Link to={`/clients/${client.id}`} className="clients__name">
                    {client.name}
                  </Link>
                  {client.accountUserId && isOnline(client.accountUserId) && (
                    <span className="clients__online" title="En línea" />
                  )}
                </span>
                <span className="clients__meta">{client.email || 'Sin email'}</span>
              </div>
              <div className="clients__actions">
                <Button size="sm" variant="ghost" onClick={() => openEdit(client)}>
                  Editar
                </Button>
                <Button size="sm" variant="danger" onClick={() => setToDelete(client)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ClientFormModal
        open={formOpen}
        client={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar cliente"
        message={`¿Seguro que quieres eliminar a ${toDelete?.name}? Se borrarán también sus rutinas.`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}