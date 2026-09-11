import { useAuth } from '../../hooks/useAuth.js'

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
        <span className="navbar__name">{user?.name || user?.email}</span>
      </div>

      <button className="navbar__logout" type="button" onClick={logout}>
        <span className="navbar__logout-full">Cerrar sesión</span>
        <span className="navbar__logout-short">Salir</span>
      </button>
    </header>
  )
}
