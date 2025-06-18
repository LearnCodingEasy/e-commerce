<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate__animated animate__fadeIn">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Products</h1>

      <!-- Filters -->
      <div
        class="flex flex-wrap gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
      >
        <div class="flex-1 min-w-64">
          <prime_input_text
            v-model="searchQuery"
            placeholder="Search products..."
            class="w-full"
            @input="debouncedSearch"
          />
        </div>

        <Dropdown
          v-model="selectedCategory"
          :options="categories"
          optionLabel="name"
          optionValue="id"
          placeholder="All Categories"
          class="min-w-48"
          @change="fetchProducts"
          showClear
        />

        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium">Price Range:</label>
          <Slider
            v-model="priceRange"
            :range="true"
            :min="0"
            :max="1000"
            :step="10"
            class="w-32"
            @slideend="fetchProducts"
          />
          <span class="text-sm text-gray-600">${{ priceRange[0] }} - ${{ priceRange[1] }}</span>
        </div>

        <Dropdown
          v-model="sortBy"
          :options="sortOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Sort by"
          class="min-w-48"
          @change="fetchProducts"
        />
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="n in 12" :key="n" class="space-y-4">
        <Skeleton height="12rem" />
        <Skeleton height="1.5rem" />
        <Skeleton height="1rem" />
        <Skeleton height="2rem" />
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-12">
      <i class="pi pi-search text-6xl text-gray-400 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
      <p class="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="(product, index) in products"
        :key="product.id"
        :product="product"
        :style="{ animationDelay: `${index * 0.1}s` }"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <div class="flex items-center space-x-2">
        <prime_button
          icon="pi pi-chevron-left"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          outlined
        />

        <span class="px-4 py-2 text-gray-700 dark:text-gray-300">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <prime_button
          icon="pi pi-chevron-right"
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          outlined
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import productService from '../services/productService'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref(null)
const priceRange = ref([0, 1000])
const sortBy = ref('name')
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 12

const sortOptions = [
  { label: 'Name A-Z', value: 'name' },
  { label: 'Name Z-A', value: '-name' },
  { label: 'Price Low to High', value: 'price' },
  { label: 'Price High to Low', value: '-price' },
  { label: 'Newest First', value: '-created_at' },
]

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 500)
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: limit,
      ordering: sortBy.value,
    }

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (selectedCategory.value) {
      params.category = selectedCategory.value
    }

    if (priceRange.value[0] > 0 || priceRange.value[1] < 1000) {
      params.min_price = priceRange.value[0]
      params.max_price = priceRange.value[1]
    }

    const response = await productService.getProducts(params)
    products.value = response.results || []
    totalPages.value = Math.ceil((response.count || 0) / limit)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await productService.getCategories()
    categories.value = response.results || response
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const changePage = (page) => {
  currentPage.value = page
  fetchProducts()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
