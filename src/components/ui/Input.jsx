import { useId } from 'react'

export default function Input({ label, error, id, className = '', ...props }) {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="ui-field">
      {label && (
        <label className="ui-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={['ui-input', error ? 'ui-input--error' : '', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <span className="ui-field__error">{error}</span>}
    </div>
  )
}