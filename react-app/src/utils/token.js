
const formalKey = 'token'
const refreshKey = 'refresh_token'

// 1. formal token
const setLocalToken = (token) => {
  return window.localStorage.setItem(formalKey, token)
}

const getLocalToken = () => {
  return window.localStorage.getItem(formalKey)
}

const removeLocalToken = () => {
  return window.localStorage.removeItem(formalKey)
}

// 2. refresh token
const setLocalRefreshToken = (refreshToken) => {
  return window.localStorage.setItem(refreshKey, refreshToken)
}

const getLocalRefreshToken = () => {
  return window.localStorage.getItem(refreshKey)
}

const removeLocalRefreshToken = () => {
  return window.localStorage.removeItem(refreshKey)
}

export {
  setLocalToken,
  getLocalToken,
  removeLocalToken,
  setLocalRefreshToken,
  getLocalRefreshToken,
  removeLocalRefreshToken,
}
