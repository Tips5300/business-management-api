<script setup lang="ts">
defineProps<{
  title: string
  value: string
  trend?: string
  trendType?: 'up' | 'down' | 'neutral'
  icon: string
  color: string
}>()
</script>

<template>
  <div class="card">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-gray-700 dark:text-gray-300 font-medium text-sm mb-1">{{ title }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</p>
        
        <div v-if="trend" class="flex items-center mt-2">
          <span 
            class="text-xs font-medium mr-1"
            :class="{
              'text-green-600 dark:text-green-400': trendType === 'up',
              'text-red-600 dark:text-red-400': trendType === 'down',
              'text-gray-600 dark:text-gray-400': trendType === 'neutral'
            }"
          >
            {{ trend }}
          </span>
          <svg v-if="trendType === 'up'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 text-green-600 dark:text-green-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          <svg v-else-if="trendType === 'down'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 text-red-600 dark:text-red-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
      
      <div 
        class="p-3 rounded-full"
        :class="{
          'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300': color === 'blue',
          'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300': color === 'green',
          'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300': color === 'purple',
          'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300': color === 'orange'
        }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" :d="icon" />
        </svg>
      </div>
    </div>
  </div>
</template>