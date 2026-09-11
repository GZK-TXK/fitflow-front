export default function Alert({ variant = 'error', children }) {
  if (!children) return null
  return <div className={`ui-alert ui-alert--${variant}`}>{children}</div>
}