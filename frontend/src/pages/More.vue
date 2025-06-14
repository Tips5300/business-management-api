<script setup lang="ts">
import { ref } from 'vue'

const menuItems = [
  {
    title: 'Staff Management',
    description: 'Manage employees and their roles',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    route: '/staff',
    color: 'blue'
  },
  {
    title: 'Invoices & Accounting',
    description: 'View and manage invoices',
    icon: 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z',
    route: '/invoices',
    color: 'green'
  },
  {
    title: 'Settings',
    description: 'Configure system settings',
    icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
    route: '/settings',
    color: 'purple'
  }
]
</script>

<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">More Options</h2>
      <p class="text-gray-600 dark:text-gray-400">Access additional features and settings</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link 
        v-for="item in menuItems" 
        :key="item.route"
        :to="item.route"
        class="card hover:shadow-lg transition-shadow duration-200 cursor-pointer group"
      >
        <div class="flex items-start space-x-4">
          <div 
            class="p-3 rounded-full group-hover:scale-110 transition-transform duration-200"
            :class="{
              'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300': item.color === 'blue',
              'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300': item.color === 'green',
              'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300': item.color === 'purple'
            }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </svg>
          </div>
          
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ item.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ item.description }}
            </p>
          </div>
          
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </router-link>
    </div>

    <!-- Quick Stats -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Stats</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Active Staff</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600 dark:text-green-400">12</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Pending Invoices</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">5</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">System Alerts</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">98%</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">System Health</div>
        </div>
      </div>
    </div>
  </div>
</template>