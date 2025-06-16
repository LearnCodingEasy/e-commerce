<template>
  <Card class="product-card card-hover h-full animate__animated animate__fadeInUp">
    <template #header>
      <div class="relative overflow-hidden">
        <img
          :src="product.image || '/placeholder.svg?height=200&width=300'"
          :alt="product.name"
          class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        <Badge
          v-if="product.quantity === 0"
          value="Out of Stock"
          severity="danger"
          class="absolute top-2 right-2"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-secondary"
            @click="viewProduct"
          />
        </div>
      </div>
    </template>

    <template #title>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {{ product.name }}
      </h3>
    </template>

    <template #subtitle>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ product.category?.name }}
      </p>
    </template>

    <template #content>
      <p class="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between mb-4">
        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          ${{ product.price }}
        </span>
        <span class="text-sm text-gray-500">
          Stock: {{ product.quantity }}
        </span>
      </div>

      <Rating :modelValue="4" :readonly="true" :cancel="false" class="mb-2" />
    </template>

    <template #footer>
      <div class="flex gap-2">
        <Button
          label="View Details"
          icon="pi pi-eye"
          class="flex-1"
          @click="viewProduct"
          outlined
        />
        <Button
          icon="pi pi-shopping-cart"
          @click="addToCart"
          :disabled="product.quantity === 0"
          :loading="loading"
          v-tooltip="'Add to Cart'"
        />
      </div>
    </template>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const cartStore = useCartStore()
const toast = useToast()

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const loading = ref(false)

const viewProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const addToCart = async () => {
  if (props.product.quantity === 0) return

  loading.value = true
  try {
    await cartStore.addToCart(props.product)
    toast.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${props.product.name} has been added to your cart`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to add product to cart',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.product-card {
  @apply border border-gray-200 dark:border-gray-700 transition-all duration-300;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
