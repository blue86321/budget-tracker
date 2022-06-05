
import axios from 'axios'
import { getLocalToken, getLocalRefreshToken, removeLocalRefreshToken, removeLocalToken, setLocalRefreshToken, setLocalToken } from 'utils/token'
import { history } from './history'

// axios package
// axios 封装

// 1.instantiation
const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 1000,
})

// 2.request interceptor (请求拦截器)
http.interceptors.request.use((config) => {
  // add token
  const token = getLocalToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
}, (error) => {
  return Promise.reject(error)
})

// 3.response interceptor (响应拦截器)
// 3.1. response.data
http.interceptors.response.use(response => response.data, error => Promise.reject(error))
// 3.2. refresh token
let isRefreshing = false
let requestQueue = []
const refreshInterceptor = http.interceptors.response.use(
  response => response,
  error => {
    // token error
    if (error.response?.status === 401 && getLocalRefreshToken()) {
      /**
       * avoid multiple query
       * source: https://zhuanlan.zhihu.com/p/80125501
       */
      if (isRefreshing) {
        return new Promise(resolve => {
          requestQueue.push((newToken) => {
            const config = error.response.config
            config.headers.Authorization = `Bearer ${newToken}`
            resolve(http(config))
          })
        })
      } else {
        isRefreshing = true

        /**
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response
         * source: https://stackoverflow.com/questions/51646853/automating-access-token-refreshing-via-interceptors-in-axios
         */
        http.interceptors.response.eject(refreshInterceptor)

        return http.post('/user/refresh_token', { refreshToken: getLocalRefreshToken() })
          .then(res => {
            setLocalToken(res.data?.token)
            // can remove this, cause we will get token in request interceptor
            // error.response.config.headers.Authorization = `Bearer ${res.data?.token}`

            // keep updating refreshToken, so that a user would never expire
            if (res.data?.refreshToken) {
              setLocalRefreshToken(res.data?.refreshToken)
            }

            requestQueue.forEach(reqObj => reqObj(res.data?.token))
            return http(error.response.config)
          })
          .catch(error => {
            removeLocalToken()
            removeLocalRefreshToken()
            // go back to login page, reactRouter does not support outside a component
            // 跳回到登录, reactRouter 默认不支持在组件之外完成路由跳转
            history.push('/login')
            return Promise.reject(error.response?.data?.message ? error.response?.data?.message : error)
          })
          .finally(() => {
            requestQueue = []
            isRefreshing = false
          })
      }
    }
    return Promise.reject(error)
  })


export { http }
