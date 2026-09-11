import { useEffect } from 'react'

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ui-modal" onClick={onClose}>
      <div className="ui-modal__dialog" onClick={(event) => event.stopPropagation()}>
        <div className="ui-modal__header">
          <h3 className="ui-modal__title">{title}</h3>
          <button
            className="ui-modal__close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="ui-modal__body">{children}</div>
      </div>
    </div>
  )
}