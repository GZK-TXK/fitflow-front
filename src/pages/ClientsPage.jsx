import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useClients } from '../hooks/useClients.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import ClientFormModal from '../components/clients/ClientFormModal.jsx'
import '../styles/clients.scss'

export default function ClientsPage() {
  const { clients, loading, error, createClient, updateClient, deleteClient } = useClients()

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
      <header className="clients__header">
        <h1>Clientes</h1>
        <Button onClick={openCreate}>Nuevo cliente</Button>
      </header>

      <Alert variant="error">{error || actionError}</Alert>

      {loading ? (
        <Spinner label="Cargando clientes..." />
      ) : clients.length === 0 ? (
        <p className="clients__empty">Todavía no tienes clientes. Crea el primero.</p>
      ) : (
        <ul className="clients__list">
          {clients.map((client) => (
            <li key={client.id} className="clients__item">
              <div className="clients__info">
                <Link to={`/clients/${client.id}`} className="clients__name">
                  {client.name}
                </Link>
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