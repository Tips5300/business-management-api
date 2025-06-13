<script setup lang="ts">
defineProps<{
  product: {
    id: number
    name: string
    price: string
    image: string
    category: string
  }
}>()

defineEmits<{
  (e: 'addToCart', product: any): void
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
    <img :src="product.image" :alt="product.name" class="w-full h-40 object-cover" />
    
    <div class="p-4">
      <h3 class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ product.name }}</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400">{{ product.category }}</p>
      
      <div class="flex items-center justify-between mt-3">
        <span class="font-bold text-primary-600 dark:text-primary-400">{{ product.price }}</span>
        
        <button 
          type="button"
          class="btn-primary text-xs py-1.5 px-3"
          @click="$emit('addToCart', product)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>