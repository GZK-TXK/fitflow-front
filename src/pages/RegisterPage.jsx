import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import '../styles/auth.scss'

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const validate = () => {
    if (form.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
    if (!/[a-z]/.test(form.password)) return 'La contraseña debe incluir una minúscula'
    if (!/[A-Z]/.test(form.password)) return 'La contraseña debe incluir una mayúscula'
    if (!/[0-9]/.test(form.password)) return 'La contraseña debe incluir un número'
    if (form.password !== form.confirm) return 'Las contraseñas no coinciden'
    return null
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      setPending(true)
    } catch (err) {
      setError(err.message || 'No se pudo registrar la cuenta')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo continuar con Google')
    } finally {
      setLoading(false)
    }
  }

  if (pending) {
    return (
      <div className="auth">
        <div className="auth__card">
          <h1 className="auth__title">Solicitud enviada</h1>
          <p className="auth__subtitle">
            Tu cuenta se ha creado y queda pendiente de aprobación por el administrador.
            Podrás iniciar sesión cuando sea activada.
          </p>
          <Link to="/login" className="auth__submit auth__submit--link">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit}>
        <h1 className="auth__title">Crear cuenta</h1>
        <p className="auth__subtitle">Empieza a gestionar tus clientes con FitFlow</p>

        {error && <p className="auth__error">{error}</p>}

        <label className="auth__field">
          <span>Nombre</span>
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label className="auth__field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>

        <label className="auth__field">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>

        <label className="auth__field">
          <span>Repite la contraseña</span>
          <input
            type="password"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </label>

        <button className="auth__submit" type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear cuenta'}
        </button>

        <p className="auth__divider">o</p>

        <button className="auth__google" type="button" onClick={handleGoogle} disabled={loading}>
          Continuar con Google
        </button>

        <p className="auth__switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  )
}