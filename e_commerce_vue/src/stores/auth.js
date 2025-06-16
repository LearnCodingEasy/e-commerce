import { defineStore } from "pinia"
import { ref, computed } from "vue"
import authService from "../services/authService"

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null)
  const token = ref(localStorage.getItem("token"))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.is_staff || false)

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await authService.login(credentials)
      token.value = response.access
      user.value = response.user
      localStorage.setItem("token", response.access)
      localStorage.setItem("refreshToken", response.refresh)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await authService.register(userData)
      token.value = response.access
      user.value = response.user
      localStorage.setItem("token", response.access)
      localStorage.setItem("refreshToken", response.refresh)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const userData = await authService.getProfile()
      user.value = userData
    } catch (error) {
      logout()
    }
  }

  const initializeAuth = () => {
    if (token.value) {
      fetchUser()
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchUser,
    initializeAuth,
  }
})
