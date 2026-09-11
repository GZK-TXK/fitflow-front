export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="ui-spinner" role="status" aria-live="polite">
      <span className="ui-spinner__circle" />
      <span className="ui-spinner__label">{label}</span>
    </div>
  )
}