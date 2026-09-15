export function formatRelative(value) {
  if (!value) return 'Nunca'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Nunca'

  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'hace un momento'
  if (minutes < 60) return `hace ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`

  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} días`

  return date.toLocaleDateString('es-ES')
}