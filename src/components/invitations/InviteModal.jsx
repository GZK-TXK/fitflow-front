import { useEffect, useState } from 'react'
import { api } from '../../lib/apiClient.js'
import Modal from '../ui/Modal.jsx'
import Input from '../ui/Input.jsx'
import Button from '../ui/Button.jsx'
import Alert from '../ui/Alert.jsx'

export default function InviteModal({ open, type, title, fixedEmail, onClose }) {
  const [email, setEmail] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    setEmail(fixedEmail || '')
    setLink('')
    setError('')
    setCopied(false)
  }, [open, fixedEmail])

  const handleGenerate = async (event) => {
    event.preventDefault()
    setError('')
    setLink('')
    setLoading(true)
    try {
      const data = await api.post('/api/invitations', { type, email: fixedEmail || email })
      setLink(data.url)
    } catch (err) {
      setError(err.message || 'No se pudo generar la invitación')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError('No se pudo copiar; copia el enlace manualmente.')
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="invite-form" onSubmit={handleGenerate}>
        <Alert variant="error">{error}</Alert>

        {!fixedEmail && (
          <Input
            label="Email del invitado"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        )}

        <Button type="submit" loading={loading}>
          Generar enlace
        </Button>
      </form>

      {link && (
        <div className="invite-link">
          <p className="invite-link__label">Enlace de invitación (caduca en 7 días):</p>
          <code className="invite-link__value">{link}</code>
          <Button size="sm" variant="accent" onClick={handleCopy}>
            {copied ? 'Copiado' : 'Copiar enlace'}
          </Button>
        </div>
      )}
    </Modal>
  )
}