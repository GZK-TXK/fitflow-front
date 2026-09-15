import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/apiClient.js'
import { useAuth } from '../hooks/useAuth.js'
import Spinner from '../components/ui/Spinner.jsx'
import '../styles/auth.scss'

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth()
  const [searchParams] = useSearchParams()
  const inviteToken = searchParams.get('invite') || ''

  const [invite, setInvite] = useState(null)
  const [loadingInvite, setLoadingInvite] = useState(true)
  const [form, setForm] = useState({ name: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let active = true
    if (!inviteToken) {
      setLoadingInvite(false)
      return
    }
    api
      .get(`/api/invitations/${inviteToken}`, { auth: false })
      .then((data) => {
        if (active) setInvite(data)
      })
      .catch(() => {
        if (active) setInvite(null)
      })
      .finally(() => {
        if (active) setLoadingInvite(false)
      })
    return () => {
      active = false
    }
  }, [inviteToken])

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
      await register({
        name: form.name,
        email: invite.email,
        password: form.password,
        inviteToken,
      })
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
      await loginWithGoogle(inviteToken)
    } catch (err) {
      if (err.status === 403) {
        setPending(true)
      } else {
        setError(err.message || 'No se pudo continuar con Google')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loadingInvite) {
    return (
      <div className="auth">
        <div className="auth__card">
          <Spinner label="Comprobando invitación..." />
        </div>
      </div>
    )
  }

  if (!invite || !invite.valid) {
    return (
      <div className="auth">
        <div className="auth__card">
          <div className="auth__brand">
            <img className="auth__logo" src="/logo-fitflow.svg" alt="FitFlow" />
          </div>
          <h1 className="auth__title">Invitación no válida</h1>
          <p className="auth__subtitle">
            {invite && invite.used
              ? 'Esta invitación ya se ha utilizado.'
              : invite && invite.expired
              ? 'Esta invitación ha caducado.'
              : 'Necesitas una invitación válida para registrarte.'}
          </p>
          <Link to="/login" className="auth__submit auth__submit--link">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  if (pending) {
    return (
      <div className="auth">
        <div className="auth__card">
          <div className="auth__brand">
            <img className="auth__logo" src="/logo-fitflow.svg" alt="FitFlow" />
          </div>
          <h1 className="auth__title">Solicitud enviada</h1>
          <p className="auth__subtitle">
            {invite.type === 'CLIENT'
              ? 'Tu cuenta se ha creado. Tu entrenador debe darte acceso para que puedas entrar.'
              : 'Tu cuenta se ha creado y queda pendiente de aprobación por el administrador.'}
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
        <div className="auth__brand">
          <img className="auth__logo" src="/logo-fitflow.svg" alt="FitFlow" />
        </div>
        <h1 className="auth__title">Crear cuenta</h1>
        <p className="auth__subtitle">
          Invitación para {invite.type === 'CLIENT' ? 'cliente' : 'entrenador'}
        </p>

        {error && <p className="auth__error">{error}</p>}

        <label className="auth__field">
          <span>Email</span>
          <input type="email" value={invite.email} readOnly disabled />
        </label>

        <label className="auth__field">
          <span>Nombre</span>
          <input name="name" value={form.name} onChange={handleChange} required />
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