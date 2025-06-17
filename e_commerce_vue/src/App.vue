<template>
  <div id="app" >
    <Navbar />
    <main class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <Toast />
    <!-- <ConfirmDialog /> -->
  </div>
</template>

<script setup>
// import { computed, onMounted } from 'vue'
import {  onMounted } from 'vue'
// import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
// import Toast from './components/Toast.vue'
// import ConfirmDialog from './components/ConfirmDialog.vue'

// const themeStore = useThemeStore()
const authStore = useAuthStore()
// const isDarkMode = computed(() => themeStore.isDarkMode)

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
