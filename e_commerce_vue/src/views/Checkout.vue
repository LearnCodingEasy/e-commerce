<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Checkout Form -->
      <div class="space-y-6">
        <!-- Shipping Information -->
        <prime_card>
          <template #title>
            <h3 class="text-xl font-semibold">Shipping Information</h3>
          </template>

          <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <InputText v-model="shippingInfo.firstName" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <InputText v-model="shippingInfo.lastName" required class="w-full" />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <InputText v-model="shippingInfo.address" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <InputText v-model="shippingInfo.city" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <InputText v-model="shippingInfo.state" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ZIP Code
                </label>
                <InputText v-model="shippingInfo.zipCode" required class="w-full" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <InputText v-model="shippingInfo.country" required class="w-full" />
              </div>
            </div>
          </template>
        </prime_card>

        <!-- Payment Information -->
        <prime_card>
          <template #title>
            <h3 class="text-xl font-semibold">Payment Information</h3>
          </template>

          <template #content>
            <div id="card-element" class="p-3 border border-gray-300 rounded-lg">
              <!-- Stripe Elements will be inserted here -->
            </div>
            <div id="card-errors" role="alert" class="text-red-600 text-sm mt-2"></div>
          </template>
        </prime_card>
      </div>

      <!-- Order Summary -->
      <div>
        <prime_card class="sticky top-8">
          <template #title>
            <h3 class="text-xl font-semibold">Order Summary</h3>
          </template>

          <template #content>
            <div class="space-y-4">
              <!-- Order Items -->
              <div class="space-y-3">
                <div
                  v-for="item in cartStore.items"
                  :key="item._id"
                  class="flex items-center space-x-3"
                >
                  <img
                    :src="item.image || '/placeholder.svg?height=50&width=50'"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded"
                  />
                  <div class="flex-1">
                    <p class="font-medium text-sm">{{ item.name }}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs">Qty: {{ item.quantity }}</p>
                  </div>
                  <p class="font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>

              <Divider />

              <!-- Totals -->
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span>{{ shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}` }}</span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Tax</span>
                  <span>${{ tax.toFixed(2) }}</span>
                </div>

                <Divider />

                <div class="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${{ total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              label="Place Order"
              class="w-full"
              @click="handlePayment"
              :loading="processing"
              :disabled="!isFormValid"
            />
          </template>
        </prime_card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useToast } from 'primevue/usetoast'
import { loadStripe } from '@stripe/stripe-js'
import orderService from '../services/orderService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

const processing = ref(false)
const stripe = ref(null)
const cardElement = ref(null)

const shippingInfo = reactive({
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'United States',
})

const tax = computed(() => cartStore.totalPrice * 0.08)
const shipping = computed(() => (cartStore.totalPrice >= 50 ? 0 : 9.99))
const total = computed(() => cartStore.totalPrice + tax.value + shipping.value)

const isFormValid = computed(() => {
  return Object.values(shippingInfo).every((value) => value.trim() !== '')
})

const initializeStripe = async () => {
  try {
    stripe.value = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here',
    )

    const elements = stripe.value.elements()
    cardElement.value = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    })

    cardElement.value.mount('#card-element')

    cardElement.value.on('change', (event) => {
      const displayError = document.getElementById('card-errors')
      if (event.error) {
        displayError.textContent = event.error.message
      } else {
        displayError.textContent = ''
      }
    })
  } catch (error) {
    console.error('Error initializing Stripe:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to initialize payment system',
      life: 3000,
    })
  }
}

const handlePayment = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please fill in all required fields',
      life: 3000,
    })
    return
  }

  processing.value = true

  try {
    // Create order
    const orderData = {
      items: cartStore.items.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress: shippingInfo,
      totalAmount: total.value,
    }

    const orderResponse = await orderService.createOrder(orderData)

    // Process payment with Stripe
    const { error, paymentIntent } = await stripe.value.confirmCardPayment(
      orderResponse.clientSecret,
      {
        payment_method: {
          card: cardElement.value,
          billing_details: {
            name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.zipCode,
              country: 'US',
            },
          },
        },
      },
    )

    if (error) {
      throw new Error(error.message)
    }

    if (paymentIntent.status === 'succeeded') {
      cartStore.clearCart()
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Order placed successfully!',
        life: 3000,
      })
      router.push(`/order-confirmation/${orderResponse.order._id}`)
    }
  } catch (error) {
    console.error('Payment error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Payment failed. Please try again.',
      life: 3000,
    })
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  initializeStripe()
})
</script>
