<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton height="24rem" />
      <div class="space-y-4">
        <Skeleton height="2rem" />
        <Skeleton height="1rem" />
        <Skeleton height="4rem" />
        <Skeleton height="3rem" />
      </div>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Product Image -->
      <div class="space-y-4">
        <img
          :src="product.image || '/placeholder.svg?height=400&width=400'"
          :alt="product.name"
          class="w-full h-96 object-cover rounded-lg shadow-lg"
        />
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ product.name }}
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            {{ product.category?.name }}
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-3xl font-bold text-primary-600 dark:text-primary-400">
            ${{ product.price.toFixed(2) }}
          </span>
          <Badge
            :value="product.stock > 0 ? 'In Stock' : 'Out of Stock'"
            :severity="product.stock > 0 ? 'success' : 'danger'"
          />
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Description</h3>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Quantity: </label>
          <InputNumber
            v-model="quantity"
            :min="1"
            :max="product.stock"
            showButtons
            buttonLayout="horizontal"
            class="w-32"
          />
        </div>

        <div class="flex space-x-4">
          <prime_button
            label="Add to Cart"
            icon="pi pi-shopping-cart"
            class="flex-1"
            @click="addToCart"
            :disabled="product.stock === 0"
            :loading="addingToCart"
          />
          <Button icon="pi pi-heart" outlined @click="addToWishlist" />
        </div>

        <div class="border-t pt-6">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-900 dark:text-white">SKU:</span>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ product.sku || 'N/A' }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">Stock:</span>
              <span class="text-gray-600 dark:text-gray-400 ml-2">{{ product.stock }} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-12">
      <i class="pi pi-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Product not found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">
        The product you're looking for doesn't exist.
      </p>
      <router-link to="/products">
        <Button label="Browse Products" />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useToast } from 'primevue/usetoast'
import productService from '../services/productService'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const product = ref(null)
const loading = ref(true)
const quantity = ref(1)
const addingToCart = ref(false)

const fetchProduct = async () => {
  try {
    const response = await productService.getProduct(route.params.id)
    product.value = response.product || response
  } catch (error) {
    console.error('Error fetching product:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load product',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!product.value || product.value.stock === 0) return

  addingToCart.value = true
  try {
    cartStore.addToCart(product.value, quantity.value)
    toast.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${quantity.value} ${product.value.name}(s) added to cart`,
      life: 3000,
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to add product to cart',
      life: 3000,
    })
  } finally {
    addingToCart.value = false
  }
}

const addToWishlist = () => {
  toast.add({
    severity: 'info',
    summary: 'Wishlist',
    detail: 'Wishlist feature coming soon!',
    life: 3000,
  })
}

onMounted(() => {
  fetchProduct()
})
</script>
