<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 animate__animated animate__fadeIn"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center animate__animated animate__fadeInUp">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Or
          <router-link to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
            sign in to existing account
          </router-link>
        </p>
      </div>

      <Card class="p-6 animate__animated animate__fadeInUp animate__delay-1s">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label for="first_name">First Name</label>
              <InputText
                id="first_name"
                v-model="form.first_name"
                required
                :class="{ 'p-invalid': errors.first_name }"
              />
              <div v-if="errors.first_name" class="error">{{ errors.first_name }}</div>
            </div>

            <div class="form-group">
              <label for="last_name">Last Name</label>
              <InputText
                id="last_name"
                v-model="form.last_name"
                required
                :class="{ 'p-invalid': errors.last_name }"
              />
              <div v-if="errors.last_name" class="error">{{ errors.last_name }}</div>
            </div>
          </div>

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
              toggleMask
            />
            <div v-if="errors.password" class="error">{{ errors.password }}</div>
          </div>

          <div class="form-group">
            <label for="password2">Confirm Password</label>
            <Password
              id="password2"
              v-model="form.password2"
              required
              :class="{ 'p-invalid': errors.password2 }"
              :feedback="false"
              toggleMask
            />
            <div v-if="errors.password2" class="error">{{ errors.password2 }}</div>
          </div>

          <Button
            type="submit"
            label="Create Account"
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
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password2: '',
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!form.first_name) {
    errors.value.first_name = 'First name is required'
  }

  if (!form.last_name) {
    errors.value.last_name = 'Last name is required'
  }

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

  if (!form.password2) {
    errors.value.password2 = 'Please confirm your password'
  } else if (form.password !== form.password2) {
    errors.value.password2 = 'Passwords do not match'
  }

  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    await authStore.register(form)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Account created successfully',
      life: 3000,
    })
    router.push('/')
  } catch (error) {
    const errorData = error.response?.data
    if (errorData) {
      if (typeof errorData === 'object') {
        Object.keys(errorData).forEach((key) => {
          if (Array.isArray(errorData[key])) {
            errors.value[key] = errorData[key][0]
          } else {
            errors.value[key] = errorData[key]
          }
        })
      } else {
        errors.value.general = 'Registration failed'
      }
    } else {
      errors.value.general = 'Registration failed'
    }

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errors.value.general || 'Registration failed',
      life: 3000,
    })
  }
}
</script>
