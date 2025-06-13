<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.path)
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/login': 'Login',
    '/register': 'Register',
    '/forgot-password': 'Forgot Password'
  }
  return titles[currentRoute.value] || 'Authentication'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary-600 mb-2">BusinessPro</h1>
        <p class="text-gray-600 dark:text-gray-400">Local Business Management Software</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold mb-6 text-center">{{ pageTitle }}</h2>
        <router-view />
      </div>
      
      <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>© {{ new Date().getFullYear() }} BusinessPro. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>