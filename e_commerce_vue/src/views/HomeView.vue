<template>
  <div>
    <!-- Hero Section -->
    <section class="gradient-bg py-20 animate__animated animate__fadeIn">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 animate__animated animate__fadeInUp">
          Welcome to E-Shop
        </h1>
        <p
          class="text-xl md:text-2xl mb-8 opacity-90 animate__animated animate__fadeInUp animate__delay-1s"
        >
          Discover amazing products at unbeatable prices
        </p>
        <router-link to="/products">
          <prime_button
            label="Shop Now"
            size="large"
            class="bg-white text-primary-600 hover:bg-gray-100 animate__animated animate__fadeInUp animate__delay-2s"
          />
        </router-link>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 animate__animated animate__fadeInUp">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Products</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Check out our most popular products that customers love
          </p>
        </div>

        <!-- Product Carousel -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 8" :key="n" class="space-y-4">
            <prime_skeleton height="12rem" />
            <prime_skeleton height="1.5rem" />
            <prime_skeleton height="1rem" />
            <prime_skeleton height="2rem" />
          </div>
        </div>

        <Carousel
          v-else-if="featuredProducts.length > 0"
          :value="featuredProducts"
          :numVisible="4"
          :numScroll="1"
          :responsiveOptions="carouselResponsiveOptions"
          class="animate__animated animate__fadeInUp animate__delay-1s"
        >
          <template #item="{ data }">
            <div class="p-3">
              <ProductCard :product="data" />
            </div>
          </template>
        </Carousel>

        <div v-else class="text-center py-12">
          <i class="pi pi-box text-6xl text-gray-400 mb-4"></i>
          <p class="text-gray-600 dark:text-gray-400">No featured products available</p>
        </div>

        <div class="text-center mt-12">
          <router-link to="/products">
            <Button
              label="View All Products"
              outlined
              class="animate__animated animate__fadeInUp animate__delay-2s"
            />
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-gray-100 dark:bg-gray-800 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center animate__animated animate__fadeInUp">
            <div
              class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-truck text-2xl text-primary-600 dark:text-primary-400"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Free Shipping</h3>
            <p class="text-gray-600 dark:text-gray-400">Free shipping on orders over $50</p>
          </div>

          <div class="text-center animate__animated animate__fadeInUp animate__delay-1s">
            <div
              class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-shield text-2xl text-primary-600 dark:text-primary-400"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Payment</h3>
            <p class="text-gray-600 dark:text-gray-400">Your payment information is safe with us</p>
          </div>

          <div class="text-center animate__animated animate__fadeInUp animate__delay-2s">
            <div
              class="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-refresh text-2xl text-primary-600 dark:text-primary-400"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Easy Returns</h3>
            <p class="text-gray-600 dark:text-gray-400">30-day return policy on all items</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'

const featuredProducts = ref([])
const loading = ref(true)

const carouselResponsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
    numScroll: 1,
  },
  {
    breakpoint: '768px',
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: '560px',
    numVisible: 1,
    numScroll: 1,
  },
]

const fetchFeaturedProducts = async () => {
  try {
    const response = await productService.getProducts({ featured: true, limit: 8 })
    featuredProducts.value = response.results || response
  } catch (error) {
    console.error('Error fetching featured products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchFeaturedProducts()
})
</script>
