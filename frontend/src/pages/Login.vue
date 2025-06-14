<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()
const email = ref('admin@example.com')
const password = ref('password123')
const rememberMe = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const response = await authAPI.login(email.value, password.value)
    console.log('Login successful:', response)
    router.push('/')
  } catch (error: any) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="login" class="space-y-6">
    <!-- Error Message -->
    <div v-if="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ errorMessage }}
    </div>

    <!-- Demo Credentials Info -->
    <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
      <p class="text-sm">
        <strong>Demo Credentials:</strong><br>
        Email: admin@example.com<br>
        Password: password123
      </p>
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Email
      </label>
      <input 
        id="email" 
        type="email" 
        v-model="email" 
        class="form-input" 
        placeholder="name@company.com" 
        required
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Password
      </label>
      <input 
        id="password" 
        type="password" 
        v-model="password" 
        class="form-input" 
        placeholder="••••••••" 
        required
      />
    </div>
    
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <input 
          id="remember-me" 
          type="checkbox" 
          v-model="rememberMe" 
          class="form-checkbox" 
        />
        <label for="remember-me" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
          Remember me
        </label>
      </div>
      
      <router-link to="/forgot-password" class="text-sm text-primary-600 hover:underline dark:text-primary-400">
        Forgot password?
      </router-link>
    </div>
    
    <button 
      type="submit" 
      class="btn btn-primary w-full py-3" 
      :disabled="isLoading"
    >
      <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ isLoading ? 'Signing in...' : 'Sign in' }}
    </button>
    
    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      Don't have an account?
      <router-link to="/register" class="text-primary-600 hover:underline dark:text-primary-400 ml-1">
        Create account
      </router-link>
    </div>
  </form>
</template>