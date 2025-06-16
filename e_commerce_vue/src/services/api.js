// import axios from "axios"
// import { useAuthStore } from "../stores/auth"

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// const authStore = useAuthStore() // Moved hook call to the top level

// // Request interceptor to add auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// // Response interceptor to handle token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = localStorage.getItem("refreshToken")
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
//             refresh: refreshToken,
//           })

//           const newToken = response.data.access
//           localStorage.setItem("token", newToken)
//           originalRequest.headers.Authorization = `Bearer ${newToken}`

//           return api(originalRequest)
//         }
//       } catch (refreshError) {
//         authStore.logout()
//         window.location.href = "/login"
//       }
//     }

//     return Promise.reject(error)
//   },
// )

// export default api
import axios from "axios"
import { useAuthStore } from "../stores/auth"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// ✅ Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })

          const newToken = response.data.access
          localStorage.setItem("token", newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`

          return api(originalRequest)
        }
      } catch (refreshError) {
        const authStore = useAuthStore() // ✅ هنا الصح
        authStore.logout()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default api
