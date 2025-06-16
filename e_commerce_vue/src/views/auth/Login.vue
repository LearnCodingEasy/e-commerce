<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeIn"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center animate__animated animate__fadeInUp">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Or
          <router-link to="/register" class="text-primary-600 hover:text-primary-500 font-medium">
            create a new account
          </router-link>
        </p>
      </div>

      <Card class="p-6 animate__animated animate__fadeInUp animate__delay-1s">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="form-group">
            <label for="email">Email Address</label>
            <InputText
              id="email"
              v-model="form.email"
              type="email"
              required
              :class="{ 'p-invalid': errors.email }"
            />
            <div v-if="errors.email" class="error">{{ errors.email }}</div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <Password
              id="password"
              v-model="form.password"
              required
              :class="{ 'p-invalid': errors.password }"
              :feedback="false"
              toggleMask
            />
            <div v-if="errors.password" class="error">{{ errors.password }}</div>
          </div>

          <Button
            type="submit"
            label="Sign In"
            class="w-full btn-primary"
            :loading="authStore.loading"
          />
        </form>

        <div
          v-if="errors.general"
          class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
        >
          {{ errors.general }}
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email is invalid'
  }

  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    await authStore.login(form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged in successfully',
      life: 3000,
    })
    router.push('/')
  } catch (error) {
    errors.value.general = error.response?.data?.detail || 'Login failed'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errors.value.general,
      life: 3000,
    })
  }
}
</script>
