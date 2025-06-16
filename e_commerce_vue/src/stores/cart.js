import { defineStore } from "pinia"
import { ref, computed } from "vue"
import cartService from "../services/cartService"
import { useAuthStore } from "./auth"

export const useCartStore = defineStore("cart", () => {
  const authStore = useAuthStore() // Moved to top level as per lint/correctness/useHookAtTopLevel
  const items = ref([])
  const loading = ref(false)

  const totalItems = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((total, item) => total + item.product.price * item.quantity, 0))

  const fetchCart = async () => {
    if (!authStore.isAuthenticated) {
      items.value = JSON.parse(localStorage.getItem("cart") || "[]")
      return
    }

    loading.value = true
    try {
      const response = await cartService.getCart()
      items.value = response.items || []
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (product, quantity = 1) => {
    if (!authStore.isAuthenticated) {
      // Handle guest cart
      const existingItem = items.value.find((item) => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        items.value.push({ product, quantity })
      }
      localStorage.setItem("cart", JSON.stringify(items.value))
      return
    }

    try {
      await cartService.addToCart(product.id, quantity)
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (!authStore.isAuthenticated) {
      const item = items.value.find((item) => item.product.id === itemId)
      if (item) {
        item.quantity = quantity
        localStorage.setItem("cart", JSON.stringify(items.value))
      }
      return
    }

    try {
      await cartService.updateQuantity(itemId, quantity)
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (itemId) => {
    if (!authStore.isAuthenticated) {
      items.value = items.value.filter((item) => item.product.id !== itemId)
      localStorage.setItem("cart", JSON.stringify(items.value))
      return
    }

    try {
      await cartService.removeFromCart(itemId)
      await fetchCart()
    } catch (error) {
      throw error
    }
  }

  const clearCart = async () => {
    if (!authStore.isAuthenticated) {
      items.value = []
      localStorage.removeItem("cart")
      return
    }

    try {
      await cartService.clearCart()
      items.value = []
    } catch (error) {
      throw error
    }
  }

  return {
    items,
    loading,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
})
