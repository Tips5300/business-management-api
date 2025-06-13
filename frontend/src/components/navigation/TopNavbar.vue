<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title: string
}>()

defineEmits<{
  (e: 'toggleSidebar'): void
}>()

const isDarkMode = ref(false)
const isProfileOpen = ref(false)
const isNotificationsOpen = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

const toggleProfileMenu = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) isNotificationsOpen.value = false
}

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) isProfileOpen.value = false
}
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
    <div class="px-4 py-3 flex items-center justify-between">
      <!-- Left: Hamburger menu and title -->
      <div class="flex items-center">
        <button 
          type="button" 
          class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 lg:hidden"
          @click="$emit('toggleSidebar')"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <!-- Desktop only: toggle sidebar button -->
        <button 
          type="button" 
          class="hidden lg:flex text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 ml-1 mr-3"
          @click="$emit('toggleSidebar')"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white">{{ title }}</h1>
      </div>
      
      <!-- Right: Actions -->
      <div class="flex items-center space-x-3">
        <!-- Dark mode toggle -->
        <button 
          type="button" 
          class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
          @click="toggleDarkMode"
          aria-label="Toggle dark mode"
        >
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        </button>
        
        <!-- Notifications -->
        <div class="relative">
          <button 
            type="button" 
            class="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 relative"
            @click="toggleNotifications"
            aria-label="View notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span class="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1">3</span>
          </button>
          
          <!-- Notifications dropdown -->
          <div v-if="isNotificationsOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
            </div>
            <div class="max-h-60 overflow-y-auto">
              <a href="#" class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <div class="flex-shrink-0 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-800 dark:text-gray-200">New invoice #INV-2023 has been created</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
                </div>
              </a>
              <a href="#" class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                <div class="flex-shrink-0 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-800 dark:text-gray-200">Inventory Alert: 5 products are low in stock</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                </div>
              </a>
              <a href="#" class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div class="flex-shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-gray-800 dark:text-gray-200">New customer registration: John Doe</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                </div>
              </a>
            </div>
            <div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <a href="#" class="text-sm text-primary-600 hover:underline dark:text-primary-400">View all notifications</a>
            </div>
          </div>
        </div>
        
        <!-- Profile dropdown -->
        <div class="relative">
          <button 
            type="button" 
            class="flex items-center text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
            @click="toggleProfileMenu"
            aria-label="Open user menu"
          >
            <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
          </button>
          
          <!-- Profile dropdown menu -->
          <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-semibold text-gray-800 dark:text-white">Admin User</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
            </div>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              Profile
            </a>
            <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
              Settings
            </a>
            <div class="border-t border-gray-200 dark:border-gray-700"></div>
            <a href="/login" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700">
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>