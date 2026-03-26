import axios from 'axios'
import { getCookie } from './cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
})

// separate client for refresh to avoid interceptors recursion
const refreshClient = axios.create({
  baseURL: api.defaults.baseURL,
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.request.use(
  config => {
    const token = getCookie('accessToken')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config
    if (!originalRequest) return Promise.reject(error)
    const status = error.response?.status
  
    // don't attempt refresh for authentication endpoints
    const authPaths = ['/api/users/verify-otp', '/api/users/send-otp', '/api/users/register', '/api/users/refresh']
    if (originalRequest.url && authPaths.some(p => originalRequest.url.includes(p))) {
      return Promise.reject(error)
    }

    const hadAuthHeader = Boolean(
      originalRequest.headers?.Authorization || api.defaults.headers.common.Authorization
    )

    if (status === 401 && !originalRequest._retry && hadAuthHeader) {
      if (isRefreshing) {
        // queue the request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const r = await refreshClient.post('/api/users/refresh')
        const newToken = r.data?.data?.accessToken
        if (!newToken) throw new Error('No refresh token returned')

        // server also sets accessToken cookie; set header for immediate use
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        try { delete api.defaults.headers.common.Authorization } catch (e) {}
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api