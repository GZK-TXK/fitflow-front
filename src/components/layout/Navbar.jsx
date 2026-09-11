import { useAuth } from '../../hooks/useAuth.js'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <span className="navbar__name">{user?.name || user?.email}</span>
      <button className="navbar__logout" type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </header>
  )
}