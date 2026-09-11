import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clients', label: 'Clientes' },
  { to: '/exercises', label: 'Ejercicios' },
  { to: '/workouts', label: 'Rutinas' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">FitFlow</div>
      <nav className="sidebar__nav">
        {links.map((link) => (
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
        ))}
      </nav>
    </aside>
  )
}