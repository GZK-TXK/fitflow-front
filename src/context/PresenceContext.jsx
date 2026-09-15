import { createContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { connectSocket, disconnectSocket } from '../lib/socket.js'

export const PresenceContext = createContext(null)

export function PresenceProvider({ children }) {
  const { token } = useAuth()
  const [onlineIds, setOnlineIds] = useState(() => new Set())
  const [lastSeen, setLastSeen] = useState({})

  useEffect(() => {
    if (!token) {
      disconnectSocket()
      setOnlineIds(new Set())
      setLastSeen({})
      return
    }

    const socket = connectSocket(token)

    const handleInit = ({ online }) => {
      setOnlineIds(new Set(online))
    }

    const handleUpdate = ({ userId, online, lastSeenAt }) => {
      setOnlineIds((prev) => {
        const next = new Set(prev)
        if (online) next.add(userId)
        else next.delete(userId)
        return next
      })
      if (!online && lastSeenAt) {
        setLastSeen((prev) => ({ ...prev, [userId]: lastSeenAt }))
      }
    }

    socket.on('presence:init', handleInit)
    socket.on('presence:update', handleUpdate)

    return () => {
      socket.off('presence:init', handleInit)
      socket.off('presence:update', handleUpdate)
    }
  }, [token])

  const value = useMemo(
    () => ({
      onlineIds,
      lastSeen,
      isOnline: (id) => Boolean(id) && onlineIds.has(id),
    }),
    [onlineIds, lastSeen]
  )

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>
}