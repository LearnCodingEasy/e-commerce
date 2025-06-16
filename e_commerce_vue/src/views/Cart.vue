<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__animated animate__fadeIn">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="text-center py-12">
      <i class="pi pi-shopping-cart text-6xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Add some products to get started</p>
      <router-link to="/products">
        <Button label="Continue Shopping" class="btn-primary" />
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <Card
          v-for="(item, index) in cartStore.items"
          :key="item.id"
          class="p-4 animate__animated animate__fadeInUp"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex items-center space-x-4">
            <img
              :src="item.product.image || '/placeholder.svg?height=100&width=100'"
              :alt="item.product.name"
              class="w-20 h-20 object-cover rounded-lg"
            />

            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ item.product.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ item.product.category?.name }}
              </p>
              <p class="text-lg font-bold text-primary-600 dark:text-primary-400">
                ${{ item.product.price }}
              </p>
            </div>

            <div class="flex items-center space-x-2">
              <InputNumber
                :modelValue="item.quantity"
                @update:modelValue="updateQuantity(item.id, $event)"
                :min="1"
                :max="item.product.quantity"
                showButtons
                buttonLayout="horizontal"
                class="w-32"
              />
            </div>

            <div class="text-right">
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </p>
              <Button
                icon="pi pi-trash"
                class="p-button-text p-button-danger mt-2"
                @click="removeItem(item.id)"
              />
            </div>
          </div>
        </Card>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <Card class="sticky top-8 animate__animated animate__fadeInUp animate__delay-1s">
          <template #title>
            <h3 class="text-xl font-semibold">Order Summary</h3>
          </template>

          <template #content>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400"
                  >Items ({{ cartStore.totalItems }})</span
                >
                <span class="font-semibold">${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                <span class="font-semibold">
                  {{ cartStore.totalPrice >= 50 ? 'Free' : '$9.99' }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Tax</span>
                <span class="font-semibold">${{ tax.toFixed(2) }}</span>
              </div>

              <Divider />

              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </template>

          <template #footer>
            <div class="space-y-2">
              <router-link to="/checkout" class="block">
                <Button
                  label="Proceed to Checkout"
                  class="w-full btn-primary"
                  :disabled="cartStore.items.length === 0"
                />
              </router-link>
              <router-link to="/products" class="block">
                <Button label="Continue Shopping" outlined class="w-full" />
              </router-link>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useToast } from 'primevue/usetoast'

const cartStore = useCartStore()
const toast = useToast()

const tax = computed(() => cartStore.totalPrice * 0.08) // 8% tax
const shipping = computed(() => (cartStore.totalPrice >= 50 ? 0 : 9.99))
const total = computed(() => cartStore.totalPrice + tax.value + shipping.value)

const updateQuantity = async (itemId, quantity) => {
  if (quantity < 1) return
  try {
    await cartStore.updateQuantity(itemId, quantity)
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Cart updated successfully',
      life: 2000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update cart',
      life: 3000,
    })
  }
}

const removeItem = async (itemId) => {
  try {
    await cartStore.removeFromCart(itemId)
    toast.add({
      severity: 'success',
      summary: 'Removed',
      detail: 'Item removed from cart',
      life: 2000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to remove item',
      life: 3000,
    })
  }
}
</script>
