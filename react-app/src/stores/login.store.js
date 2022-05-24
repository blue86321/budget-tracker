import { makeAutoObservable } from "mobx"
import { getLocalToken, http, setLocalToken } from "utils"
import { setLocalRefreshToken } from "utils/token"


export default class LoginStore {
  token = getLocalToken() || ''

  constructor() {
    makeAutoObservable(this)
  }

  login = async (values) => {
    const { username, password } = values
    const formatParams = { username, password }
    if (username === 'guest' && password === 'guest') {
      setLocalToken('fake token')
      setLocalRefreshToken('fake refresh token')
      return
    }
    const res = await http.post('/user/login', formatParams)
    // keep token
    if (res.data?.token) {
      setLocalToken(res.data.token)
      if (res.data?.refreshToken) {
        setLocalRefreshToken(res.data.refreshToken)
      }
    } else {
      throw 'Login failed'
    }
  }

  register = async (values) => {
    const { username, password } = values
    const formatParams = { username, password }
    try {
      const res = await http.post('/user/register', formatParams)
      if (res.data?.token) {
        setLocalToken(res.data.token)
        if (res.data?.refreshToken) {
          setLocalRefreshToken(res.data.refreshToken)
        }
      }
    } catch (e) {
      throw e
    }
  }
}
