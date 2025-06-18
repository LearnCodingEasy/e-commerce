import api from "./api"

export default {
  async getProducts(params = {}) {
    const response = await api.get("/products/", { params })
    return response.data
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}/`)
    console.log(`ser ${response.data}`);
    return response.data
  },

  async createProduct(productData) {
    const response = await api.post("/products/", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}/`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}/`)
    return response.data
  },

  async getCategories() {
    const response = await api.get("/categories/")
    return response.data
  },

  async createCategory(categoryData) {
    const response = await api.post("/categories/", categoryData)
    return response.data
  },
}
