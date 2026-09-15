import { io } from 'socket.io-client'
import { API_URL } from '../config/api.js'

let socket = null

export const connectSocket = (token) => {
  if (socket && socket.auth?.token === token) return socket

  if (socket) {
    socket.disconnect()
    socket = null
  }

  socket = io(API_URL, { auth: { token } })
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}