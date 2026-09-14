import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/apiClient.js'
import { setToken, clearToken, setUnauthorizedHandler } from '../lib/tokenStore.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(null)

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const applySession = useCallback((data) => {
    setToken(data.token)
    setTokenState(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const login = useCallback(
    async (credentials) => {
      const data = await api.post('/api/auth/login', credentials, { auth: false })
      return applySession(data)
    },
    [applySession]
  )

  const register = useCallback(async (payload) => {
    const data = await api.post('/api/auth/register', payload, { auth: false })
    return data
  }, [])

  const loginWithGoogle = useCallback(async () => {
    const [firebaseAuth, firebaseConfig] = await Promise.all([
      import('firebase/auth'),
      import('../config/firebase.js'),
    ])
    const result = await firebaseAuth.signInWithPopup(firebaseConfig.auth, firebaseConfig.googleProvider)
    const idToken = await result.user.getIdToken()
    const data = await api.post('/api/auth/google', { idToken }, { auth: false })
    return applySession(data)
  }, [applySession])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, token, login, register, loginWithGoogle, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}