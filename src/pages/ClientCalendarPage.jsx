import { useMySchedule } from '../hooks/useSchedule.js'
import Spinner from '../components/ui/Spinner.jsx'
import Alert from '../components/ui/Alert.jsx'
import PageHeader from '../components/ui/PageHeader.jsx'
import Calendar from '../components/calendar/Calendar.jsx'
import '../styles/calendar.scss'

export default function ClientCalendarPage() {
  const { schedule, loading, error } = useMySchedule()

  return (
    <section className="schedule">
      <PageHeader title="Mi calendario" />

      <Alert variant="error">{error}</Alert>

      {loading ? (
        <Spinner label="Cargando tu calendario..." />
      ) : (
        <Calendar items={schedule} readOnly />
      )}
    </section>
  )
}