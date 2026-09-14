import { CreditCard } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import '../styles/admin.scss'

export default function AdminSubscriptionsPage() {
  return (
    <section className="admin">
      <PageHeader title="Suscripciones" />
      <EmptyState
        icon={<CreditCard size={32} />}
        title="Próximamente"
        message="Gestión de suscripciones y facturación."
      />
    </section>
  )
}