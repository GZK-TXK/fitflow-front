import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  CalendarDays,
  UserCog,
  CreditCard,
  UserRound,
  FileCode,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

const trainerLinks = [
  { to: '/', label: 'Dashboard', end: true, icon: LayoutDashboard },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/exercises', label: 'Ejercicios', icon: Dumbbell },
  { to: '/workouts', label: 'Rutinas', icon: ClipboardList },
  { to: '/schedule', label: 'Calendario', icon: CalendarDays },
]

const clientLinks = [
  { to: '/portal', label: 'Mis rutinas', end: true, icon: ClipboardList },
  { to: '/portal/calendar', label: 'Calendario', icon: CalendarDays },
  { to: '/portal/profile', label: 'Mi perfil', icon: UserRound },
]

const adminLinks = [
  { to: '/admin', label: 'Panel', end: true, icon: LayoutDashboard },
  { to: '/admin/users', label: 'Usuarios', icon: UserCog },
  { to: '/admin/subscriptions', label: 'Suscripciones', icon: CreditCard },
  { to: '/admin/docs', label: 'API Docs', icon: FileCode },
]

function renderLink(link, onClose) {
  const Icon = link.icon
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
      <Icon className="sidebar__icon" size={18} aria-hidden="true" />
      <span>{link.label}</span>
    </NavLink>
  )
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const isClient = user?.role === 'CLIENT'

  const links = isClient ? clientLinks : trainerLinks

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="" width="26" height="26" />
          <span>FitFlow</span>
        </div>
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
        <span className="sidebar__section">Principal</span>
        {links.map((link) => renderLink(link, onClose))}

        {!isClient && (
          <NavLink
            to="/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <UserRound className="sidebar__icon" size={18} aria-hidden="true" />
            <span>Mi perfil</span>
          </NavLink>
        )}

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