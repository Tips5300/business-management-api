<script setup lang="ts">
defineProps<{
  categories: string[]
  selectedCategory: string
}>()

defineEmits<{
  (e: 'selectCategory', category: string): void
}>()
</script>

<template>
  <div class="flex overflow-x-auto py-2 -mx-4 px-4 space-x-2 no-scrollbar">
    <button
      v-for="category in categories"
      :key="category"
      class="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors duration-200"
      :class="category === selectedCategory 
        ? 'bg-primary-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'"
      @click="$emit('selectCategory', category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>