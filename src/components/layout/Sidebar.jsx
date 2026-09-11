import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clients', label: 'Clientes' },
  { to: '/exercises', label: 'Ejercicios' },
  { to: '/workouts', label: 'Rutinas' },
]

const adminLinks = [
  { to: '/admin', label: 'Panel', end: true },
  { to: '/admin/trainers', label: 'Entrenadores' },
  { to: '/admin/subscriptions', label: 'Suscripciones' },
]

function renderLink(link) {
  return (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      className={({ isActive }) =>
        `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
      }
    >
      {link.label}
    </NavLink>
  )
}

export default function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">FitFlow</div>
      <nav className="sidebar__nav">
        {links.map(renderLink)}
        {isAdmin && (
          <>
            <span className="sidebar__section">Admin</span>
            {adminLinks.map(renderLink)}
          </>
        )}
      </nav>
    </aside>
  )
}