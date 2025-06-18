<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Profile Information -->
      <div class="lg:col-span-1">
        <prime_card>
          <template #title>
            <h3 class="text-xl font-semibold">Profile Information</h3>
          </template>

          <template #content>
            <form @submit.prevent="updateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <prime_input_text v-model="profileForm.name" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <prime_input_text
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="w-full"
                />
              </div>

              <Button
                type="submit"
                label="Update Profile"
                class="w-full"
                :loading="updatingProfile"
              />
            </form>
          </template>
        </prime_card>
      </div>

      <!-- Order History -->
      <div class="lg:col-span-2">
        <prime_card>
          <template #title>
            <h3 class="text-xl font-semibold">Order History</h3>
          </template>

          <template #content>
            <div v-if="loadingOrders" class="space-y-4">
              <Skeleton height="4rem" v-for="n in 3" :key="n" />
            </div>

            <div v-else-if="orders.length === 0" class="text-center py-8">
              <i class="pi pi-shopping-bag text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600 dark:text-gray-400">No orders found</p>
              <router-link to="/products" class="mt-4 inline-block">
                <Button label="Start Shopping" />
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <prime_card v-for="order in orders" :key="order._id" class="border">
                <template #content>
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <p class="font-semibold">Order #{{ order._id }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ formatDate(order.createdAt) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <Badge :value="order.status" :severity="getStatusSeverity(order.status)" />
                      <p class="font-semibold mt-1">${{ order.totalAmount.toFixed(2) }}</p>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div
                      v-for="item in order.items"
                      :key="item._id"
                      class="flex items-center space-x-3"
                    >
                      <img
                        :src="item.product.image || '/placeholder.svg?height=40&width=40'"
                        :alt="item.product.name"
                        class="w-10 h-10 object-cover rounded"
                      />
                      <div class="flex-1">
                        <p class="text-sm font-medium">{{ item.product.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          Qty: {{ item.quantity }}
                        </p>
                      </div>
                      <p class="text-sm font-semibold">
                        ${{ (item.price * item.quantity).toFixed(2) }}
                      </p>
                    </div>
                  </div>
                </template>

                <template #footer>
                  <div class="flex space-x-2">
                    <router-link :to="`/order-confirmation/${order._id}`">
                      <Button label="View Details" outlined size="small" />
                    </router-link>
                    <Button
                      v-if="order.status === 'delivered'"
                      label="Reorder"
                      size="small"
                      @click="reorder(order)"
                    />
                  </div>
                </template>
              </prime_card>
            </div>
          </template>
        </prime_card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useToast } from 'primevue/usetoast'
import orderService from '../services/orderService'
import authService from '../services/authService'

const authStore = useAuthStore()
const cartStore = useCartStore()
const toast = useToast()

const orders = ref([])
const loadingOrders = ref(true)
const updatingProfile = ref(false)

const profileForm = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
})

const fetchOrders = async () => {
  try {
    const response = await orderService.getOrders()
    orders.value = response.orders || response
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loadingOrders.value = false
  }
}

const updateProfile = async () => {
  updatingProfile.value = true
  try {
    await authService.updateProfile(profileForm)
    await authStore.fetchUser()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully',
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Failed to update profile',
      life: 3000,
    })
  } finally {
    updatingProfile.value = false
  }
}

const reorder = (order) => {
  order.items.forEach((item) => {
    cartStore.addToCart(item.product, item.quantity)
  })
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Items added to cart',
    life: 3000,
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusSeverity = (status) => {
  const severityMap = {
    pending: 'warning',
    processing: 'info',
    shipped: 'success',
    delivered: 'success',
    cancelled: 'danger',
  }
  return severityMap[status] || 'info'
}

onMounted(() => {
  fetchOrders()
})
</script>
