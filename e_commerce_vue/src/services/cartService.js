import api from "./api"

export default {
  async getCart() {
    const response = await api.get("/cart/")
    return response.data
  },

  async addToCart(productId, quantity) {
    const response = await api.post("/cart/add/", {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  async updateQuantity(itemId, quantity) {
    const response = await api.put(`/cart/items/${itemId}/`, { quantity })
    return response.data
  },

  async removeFromCart(itemId) {
    const response = await api.delete(`/cart/items/${itemId}/`)
    return response.data
  },

  async clearCart() {
    const response = await api.delete("/cart/clear/")
    return response.data
  },
}
