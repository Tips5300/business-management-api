<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const isLoading = ref(false)
const resetSent = ref(false)

const sendResetLink = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    resetSent.value = true
  }, 1000)
}
</script>

<template>
  <div>
    <div v-if="!resetSent">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form @submit.prevent="sendResetLink" class="space-y-6">
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
        
        <button 
          type="submit" 
          class="btn btn-primary w-full py-3" 
          :disabled="isLoading"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Sending...' : 'Reset Password' }}
        </button>
      </form>
    </div>
    
    <div v-else class="text-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-green-500 mb-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">Check your email</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        We've sent a password reset link to <span class="font-medium">{{ email }}</span>
      </p>
      
      <button 
        type="button" 
        class="btn btn-primary"
        @click="resetSent = false"
      >
        Send another link
      </button>
    </div>
    
    <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
      Remember your password?
      <router-link to="/login" class="text-primary-600 hover:underline dark:text-primary-400 ml-1">
        Back to login
      </router-link>
    </div>
  </div>
</template>