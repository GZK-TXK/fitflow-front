let token = null
let unauthorizedHandler = null

export const getToken = () => token

export const setToken = (value) => {
  token = value
}

export const clearToken = () => {
  token = null
}

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler
}

export const notifyUnauthorized = () => {
  if (unauthorizedHandler) unauthorizedHandler()
}