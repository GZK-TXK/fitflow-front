import { useState } from 'react'
import { Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.js'
import { useUsers } from '../hooks/useAdmin.js'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import '../styles/admin.scss'

const statusLabels = { ACTIVE: 'Activo', PENDING: 'Pendiente', DISABLED: 'Desactivado' }
const statusClass = {
  ACTIVE: 'admin__badge--active',
  PENDING: 'admin__badge--pending',
  DISABLED: 'admin__badge--disabled',
}
const roleFilters = [
  { value: '', label: 'Todos' },
  { value: 'TRAINER', label: 'Entrenadores' },
  { value: 'CLIENT', label: 'Clientes' },
  { value: 'ADMIN', label: 'Admins' },
]

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [roleFilter, setRoleFilter] = useState('')
  const { users, loading, error, updateStatus, updateRole, deleteUser } = useUsers(roleFilter)

  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  const runAction = async (fn) => {
    setActionError('')
    try {
      await fn()
    } catch (err) {
      setActionError(err.message || 'No se pudo realizar la acción')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    await runAction(() => deleteUser(toDelete.id))
    setDeleting(false)
    setToDelete(null)
  }

  return (
    <section className="admin">
      <PageHeader title="Usuarios" subtitle="Aprobar, activar o desactivar cuentas" />

      <Alert variant="error">{error || actionError}</Alert>

      <div className="admin__filters">
        {roleFilters.map((filter) => (
          <button
            key={filter.value || 'all'}
            type="button"
            className={`admin__filter${
              roleFilter === filter.value ? ' admin__filter--active' : ''
            }`}
            onClick={() => setRoleFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Cargando usuarios..." />
      ) : users.length === 0 ? (
        <EmptyState icon={<Users size={32} />} message="No hay usuarios para este filtro." />
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Clientes</th>
                <th>Ejercicios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u.id === user?.id
                return (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`admin__badge${
                          u.role === 'ADMIN' ? ' admin__badge--admin' : ''
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`admin__badge ${statusClass[u.status] || ''}`}>
                        {statusLabels[u.status] || u.status}
                      </span>
                    </td>
                    <td>{u._count?.clients ?? 0}</td>
                    <td>{u._count?.exercises ?? 0}</td>
                    <td className="admin__row-actions">
                      {u.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="accent"
                          disabled={isSelf}
                          onClick={() => runAction(() => updateStatus(u.id, 'ACTIVE'))}
                        >
                          Aprobar
                        </Button>
                      )}
                      {u.status === 'ACTIVE' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isSelf}
                          onClick={() => runAction(() => updateStatus(u.id, 'DISABLED'))}
                        >
                          Desactivar
                        </Button>
                      )}
                      {u.status === 'DISABLED' && (
                        <Button
                          size="sm"
                          variant="accent"
                          disabled={isSelf}
                          onClick={() => runAction(() => updateStatus(u.id, 'ACTIVE'))}
                        >
                          Activar
                        </Button>
                      )}
                      {(u.role === 'TRAINER' || u.role === 'ADMIN') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isSelf}
                          onClick={() =>
                            runAction(() =>
                              updateRole(u.id, u.role === 'ADMIN' ? 'TRAINER' : 'ADMIN')
                            )
                          }
                        >
                          {u.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={isSelf}
                        onClick={() => setToDelete(u)}
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
        title="Eliminar usuario"
        message={`¿Seguro que quieres eliminar a ${toDelete?.name}? Se borrarán sus datos asociados.`}
        confirmLabel="Eliminar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}