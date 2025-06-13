<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const firstName = ref('')
const lastName = ref('')
const businessName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const agreeTerms = ref(false)

const register = () => {
  isLoading.value = true
  
  // Simulate API call
  setTimeout(() => {
    isLoading.value = false
    router.push('/login')
  }, 1000)
}
</script>

<template>
  <form @submit.prevent="register" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="first-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Name
        </label>
        <input 
          id="first-name" 
          type="text" 
          v-model="firstName" 
          class="form-input" 
          required
        />
      </div>
      
      <div>
        <label for="last-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Name
        </label>
        <input 
          id="last-name" 
          type="text" 
          v-model="lastName" 
          class="form-input" 
          required
        />
      </div>
    </div>
    
    <div>
      <label for="business-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Business Name
      </label>
      <input 
        id="business-name" 
        type="text" 
        v-model="businessName" 
        class="form-input" 
        required
      />
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
    
    <div>
      <label for="confirm-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Confirm Password
      </label>
      <input 
        id="confirm-password" 
        type="password" 
        v-model="confirmPassword" 
        class="form-input" 
        placeholder="••••••••" 
        required
      />
    </div>
    
    <div class="flex items-start">
      <div class="flex items-center h-5">
        <input 
          id="terms" 
          type="checkbox" 
          v-model="agreeTerms" 
          class="form-checkbox" 
          required
        />
      </div>
      <div class="ml-3 text-sm">
        <label for="terms" class="text-gray-600 dark:text-gray-400">
          I agree to the <a href="#" class="text-primary-600 hover:underline dark:text-primary-400">Terms and Conditions</a>
        </label>
      </div>
    </div>
    
    <button 
      type="submit" 
      class="btn btn-primary w-full py-3 mt-4" 
      :disabled="isLoading || !agreeTerms"
      :class="{'opacity-50 cursor-not-allowed': isLoading || !agreeTerms}"
    >
      <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {{ isLoading ? 'Creating account...' : 'Create account' }}
    </button>
    
    <div class="text-center text-sm text-gray-600 dark:text-gray-400">
      Already have an account?
      <router-link to="/login" class="text-primary-600 hover:underline dark:text-primary-400 ml-1">
        Sign in
      </router-link>
    </div>
  </form>
</template>