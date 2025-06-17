import api from "./api"

export default {
  async createOrder(orderData) {
    const response = await api.post("/orders/", orderData)
    return response.data
  },

  async getOrders() {
    const response = await api.get("/orders/")
    return response.data
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}/`)
    return response.data
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/orders/${id}/`, { status })
    return response.data
  },
}
