import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useClients } from '../hooks/useClients.js'
import { useClientSchedule } from '../hooks/useSchedule.js'
import { api } from '../lib/apiClient.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import Calendar from '../components/calendar/Calendar.jsx'
import AssignmentModal from '../components/calendar/AssignmentModal.jsx'
import '../styles/calendar.scss'

export default function SchedulePage() {
  const { clients } = useClients()
  const [clientId, setClientId] = useState('')
  const [workouts, setWorkouts] = useState([])
  const { schedule, loading, error, add, remove } = useClientSchedule(clientId)

  const [modalDate, setModalDate] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    if (!clientId) {
      setWorkouts([])
      return
    }
    let active = true
    api
      .get(`/api/clients/${clientId}`)
      .then((data) => {
        if (active) setWorkouts(data.workouts || [])
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [clientId])

  const handleDelete = async () => {
    setDeleting(true)
    setActionError('')
    try {
      await remove(toDelete.id)
      setToDelete(null)
    } catch (err) {
      setActionError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="schedule">
      <PageHeader
        title="Calendario"
        actions={
          <label className="schedule__selector">
            <span>Cliente</span>
            <select
              className="ui-input"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
            >
              <option value="">Selecciona un cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <Alert variant="error">{error || actionError}</Alert>

      {!clientId ? (
        <EmptyState
          icon={<CalendarDays size={32} />}
          message="Selecciona un cliente para ver y asignar sus rutinas."
        />
      ) : loading ? (
        <Spinner label="Cargando calendario..." />
      ) : (
        <Calendar
          items={schedule}
          onDayClick={(date) => setModalDate(date)}
          onDeleteItem={(item) => setToDelete(item)}
        />
      )}

      <AssignmentModal
        open={Boolean(modalDate)}
        date={modalDate}
        workouts={workouts}
        onClose={() => setModalDate(null)}
        onSubmit={add}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Quitar asignación"
        message={`¿Quitar "${toDelete?.workout?.title}" del calendario?`}
        confirmLabel="Quitar"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  )
}