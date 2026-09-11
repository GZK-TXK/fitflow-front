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

function renderLink(link, onClose) {
  return (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      onClick={onClose}
      className={({ isActive }) =>
        `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
      }
    >
      {link.label}
    </NavLink>
  )
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">FitFlow</div>
        <button
          className="sidebar__close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          ×
        </button>
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => renderLink(link, onClose))}
        {isAdmin && (
          <>
            <span className="sidebar__section">Admin</span>
            {adminLinks.map((link) => renderLink(link, onClose))}
          </>
        )}
      </nav>
    </aside>
  )
}
