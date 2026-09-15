export default function Avatar({ user, size = 32 }) {
  const name = (user?.name || user?.email || '').trim()
  const initials = name ? name[0].toUpperCase() : '?'

  if (user?.avatarUrl) {
    return (
      <img
        className="ui-avatar"
        src={user.avatarUrl}
        alt=""
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <span
      className="ui-avatar ui-avatar--fallback"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials}
    </span>
  )
}