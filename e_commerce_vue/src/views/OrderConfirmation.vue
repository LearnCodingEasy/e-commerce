<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
    </div>

    <div v-else-if="order" class="text-center">
      <!-- Success Icon -->
      <div class="mb-8">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <i class="pi pi-check text-2xl text-green-600"></i>
        </div>
      </div>

      <!-- Success Message -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Order Confirmed!
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Thank you for your purchase. Your order has been successfully placed.
      </p>

      <!-- Order Details -->
      <Card class="max-w-2xl mx-auto text-left">
        <template #title>
          <h3 class="text-xl font-semibold">Order Details</h3>
        </template>
        
        <template #content>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
                <p class="font-semibold">{{ order._id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                <p class="font-semibold">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge :value="order.status" :severity="getStatusSeverity(order.status)" />
              </div>
              <div>
                <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                <p class="font-semibold text-lg">${{ order.totalAmount.toFixed(2) }}</p>
              </div>
            </div>

            <Divider />

            <!-- Order Items -->
            <div>
              <h4 class="font-semibold mb-3">Items Ordered</h4>
              <div class="space-y-3">
                <div v-for="item in order.items" :key="item._id" class="flex items-center space-x-3">
                  <img 
                    :src="item.product.image || '/placeholder.svg?height=50&width=50'" 
                    :alt="item.product.name"
                    class="w-12 h-12 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="font-medium">{{ item.product.name }}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">
                      Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                    </p>
                  </div>
                  <p class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>

            <Divider />

            <!-- Shipping Address -->
            <div>
              <h4 class="font-semibold mb-3">Shipping Address</h4>
              <div class="text-gray-700 dark:text-gray-300">
                <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                <p>{{ order.shippingAddress.address }}</p>
                <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                <p>{{ order.shippingAddress.country }}</p>
              </div>
            </div>
          </div>
        </template>
        
        <template #footer>
          <div class="flex space-x-4">
            <router-link to="/products" class="flex-1">
              <Button label="Continue Shopping" outlined class="w-full" />
            </router-link>
            <router-link to="/profile" class="flex-1">
              <Button label="View Orders" class="w-full" />
            </router-link>
          </div>
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Order not found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">The order you're looking for doesn't exist.</p>
      <router-link to="/">
        <Button label="Go Home" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '../services/orderService'

const route = useRoute()
const order = ref(null)
const loading = ref(true)

const fetchOrder = async () => {
  try {
    const response = await orderService.getOrder(route.params.orderId)
    order.value = response.order || response
  } catch (error) {
    console.error('Error fetching order:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusSeverity = (status) => {
  const severityMap = {
    'pending': 'warning',
    'processing': 'info',
    'shipped': 'success',
    'delivered': 'success',
    'cancelled': 'danger'
  }
  return severityMap[status] || 'info'
}

onMounted(() => {
  fetchOrder()
})
</script>
