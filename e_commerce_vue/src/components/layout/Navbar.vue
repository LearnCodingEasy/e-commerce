<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
          >
            <i class="pi pi-shopping-bag mr-2"></i>
            E-Shop
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/products" class="nav-link">Products</router-link>
        </div>

        <!-- Right Side -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <Button
            :icon="themeStore.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
            class="p-button-text p-button-rounded"
            @click="themeStore.toggleDarkMode()"
            v-tooltip="themeStore.isDarkMode ? 'Light Mode' : 'Dark Mode'"
          />

          <!-- Cart -->
          <router-link to="/cart" class="relative">
            <Button icon="pi pi-shopping-cart" class="p-button-text p-button-rounded" />
            <Badge
              v-if="cartStore.totalItems > 0"
              :value="cartStore.totalItems"
              class="absolute -top-2 -right-2 animate-pulse"
            />
          </router-link>

          <!-- User Menu -->
          <div v-if="authStore.isAuthenticated" class="relative">
            <Button
              :label="authStore.user?.first_name || 'User'"
              icon="pi pi-user"
              class="p-button-text"
              @click="toggleUserMenu"
            />
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 animate__animated animate__fadeIn animate__faster"
            >
              <router-link to="/profile" class="dropdown-item" @click="showUserMenu = false">
                <i class="pi pi-user mr-2"></i>Profile
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="dropdown-item"
                @click="showUserMenu = false"
              >
                <i class="pi pi-cog mr-2"></i>Admin Dashboard
              </router-link>
              <button @click="handleLogout" class="dropdown-item w-full text-left">
                <i class="pi pi-sign-out mr-2"></i>Logout
              </button>
            </div>
          </div>

          <!-- Login/Register -->
          <div v-else class="flex items-center space-x-2">
            <router-link to="/login">
              <Button label="Login" class="p-button-text" />
            </router-link>
            <router-link to="/register">
              <Button label="Register" />
            </router-link>
          </div>

          <!-- Mobile Menu Button -->
          <Button icon="pi pi-bars" class="p-button-text md:hidden" @click="toggleMobileMenu" />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="showMobileMenu"
        class="md:hidden animate__animated animate__slideInDown animate__faster"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 bg-gray-50 dark:bg-gray-700 rounded-lg mt-2">
          <router-link to="/" class="mobile-nav-link" @click="showMobileMenu = false"
            >Home</router-link
          >
          <router-link to="/products" class="mobile-nav-link" @click="showMobileMenu = false"
            >Products</router-link
          >
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useCartStore } from '../../stores/cart'
import { useThemeStore } from '../../stores/theme'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const themeStore = useThemeStore()

const showUserMenu = ref(false)
const showMobileMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  router.push('/')
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false
    showMobileMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  cartStore.fetchCart()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.nav-link {
  @apply text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200;
}

.router-link-active.nav-link {
  @apply text-primary-600 dark:text-primary-400;
}

.dropdown-item {
  @apply block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200;
}

.mobile-nav-link {
  @apply block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-200;
}
</style>
