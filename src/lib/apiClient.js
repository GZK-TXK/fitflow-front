import { API_URL } from '../config/api.js'
import { getToken, notifyUnauthorized } from './tokenStore.js'

const parseResponse = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const request = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const options = { method, headers }
  if (body !== undefined) options.body = JSON.stringify(body)

  let response
  try {
    response = await fetch(`${API_URL}${path}`, options)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const data = await parseResponse(response)

  if ((response.status === 401 || response.status === 403) && auth) {
    notifyUnauthorized()
  }

  if (!response.ok) {
    const message = (data && data.error) || 'Ha ocurrido un error'
    const error = new Error(message)
    error.status = response.status
    error.details = data && data.details
    throw error
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}