import { useContext } from 'react'
import { PresenceContext } from '../context/PresenceContext.jsx'

export function usePresence() {
  const context = useContext(PresenceContext)
  if (!context) {
    throw new Error('usePresence debe usarse dentro de PresenceProvider')
  }
  return context
}