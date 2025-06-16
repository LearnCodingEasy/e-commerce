import api from "./api"

export default {
  async login(credentials) {
    const response = await api.post("/auth/login/", credentials)
    return response.data
  },

  async register(userData) {
    const response = await api.post("/auth/register/", userData)
    return response.data
  },

  async getProfile() {
    const response = await api.get("/auth/profile/")
    return response.data
  },

  async updateProfile(userData) {
    const response = await api.put("/auth/profile/", userData)
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post("/auth/token/refresh/", { refresh: refreshToken })
    return response.data
  },
}
