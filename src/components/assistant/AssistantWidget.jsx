import { useMemo, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { trainerFaq, clientFaq } from '../../data/faq.js'

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const findAnswer = (query, faq) => {
  const q = normalize(query)
  let best = null
  let bestScore = 0

  for (const item of faq) {
    let score = 0

    for (const keyword of item.keywords) {
      if (q.includes(normalize(keyword))) score += 2
    }

    for (const word of normalize(item.q).split(/\s+/)) {
      if (word.length > 3 && q.includes(word)) score += 1
    }

    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  return bestScore > 0 ? best.a : null
}

export default function AssistantWidget() {
  const { user } = useAuth()
  const faq = user?.role === 'CLIENT' ? clientFaq : trainerFaq

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])

  const suggestions = useMemo(() => faq.slice(0, 5).map((item) => item.q), [faq])

  const ask = (question) => {
    const answer =
      findAnswer(question, faq) ||
      'No tengo una respuesta para eso. Prueba a reformular la pregunta o escribe a soporte.'
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: question },
      { role: 'assistant', text: answer },
    ])
    setInput('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim()) return
    ask(input.trim())
  }

  return (
    <div className="assistant">
      {open && (
        <div className="assistant__panel">
          <div className="assistant__header">
            <span>Asistente FitFlow</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
              <X size={18} />
            </button>
          </div>

          <div className="assistant__body">
            {messages.length === 0 && (
              <p className="assistant__welcome">
                ¡Hola! Soy tu asistente. ¿En qué te ayudo? Elige una pregunta o escribe la tuya.
              </p>
            )}

            {messages.map((message, index) => (
              <div key={index} className={`assistant__msg assistant__msg--${message.role}`}>
                {message.text}
              </div>
            ))}

            {messages.length === 0 && (
              <div className="assistant__suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="assistant__chip"
                    onClick={() => ask(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="assistant__form" onSubmit={handleSubmit}>
            <input
              className="assistant__input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu duda..."
            />
            <button className="assistant__send" type="submit" aria-label="Enviar">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className="assistant__toggle"
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Abrir asistente"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}