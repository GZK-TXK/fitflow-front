import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useTrainers } from '../hooks/useAdmin.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import '../styles/admin.scss'

export default function AdminTrainersPage() {
  const { user } = useAuth()
  const { trainers, loading, error, updateRole, deleteTrainer } = useTrainers()

  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const handleToggleRole = async (trainer) => {
    setActionError('')
    try {
      await updateRole(trainer.id, trainer.role === 'ADMIN' ? 'TRAINER' : 'ADMIN')
    } catch (err) {
      setActionError(err.message)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await deleteTrainer(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="admin">
      <h1>Entrenadores</h1>

      <Alert variant="error">{error || actionError}</Alert>

      {loading ? (
        <Spinner label="Cargando entrenadores..." />
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Clientes</th>
                <th>Ejercicios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => {
                const isSelf = trainer.id === user?.id
                return (
                  <tr key={trainer.id}>
                    <td>{trainer.name}</td>
                    <td>{trainer.email}</td>
                    <td>
                      <span
                        className={`admin__badge ${
                          trainer.role === 'ADMIN' ? 'admin__badge--admin' : ''
                        }`}
                      >
                        {trainer.role}
                      </span>
                    </td>
                    <td>{trainer._count?.clients ?? 0}</td>
                    <td>{trainer._count?.exercises ?? 0}</td>
                    <td className="admin__row-actions">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isSelf}
                        onClick={() => handleToggleRole(trainer)}
                      >
                        {trainer.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={isSelf}
                        onClick={() => setToDelete(trainer)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar entrenador"
        message={`¿Seguro que quieres eliminar a ${toDelete?.name}? Se borrarán sus clientes, ejercicios y rutinas.`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}