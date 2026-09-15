import { useAuth } from '../../hooks/useAuth.js'
import Avatar from '../ui/Avatar.jsx'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__menu-button"
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>
        <div className="navbar__user">
          <Avatar user={user} size={32} />
          <span className="navbar__name">{user?.name || user?.email}</span>
        </div>
      </div>

      <button className="navbar__logout" type="button" onClick={logout}>
        <span className="navbar__logout-full">Cerrar sesión</span>
        <span className="navbar__logout-short">Salir</span>
      </button>
    </header>
  )
}