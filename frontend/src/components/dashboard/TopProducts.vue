<script setup lang="ts">
// Mock data for top products
const topProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=100',
    sold: 154,
    revenue: '₹ 30,800'
  },
  {
    id: 2,
    name: 'Smartphone Charger',
    image: 'https://images.pexels.com/photos/4526482/pexels-photo-4526482.jpeg?auto=compress&cs=tinysrgb&w=100',
    sold: 132,
    revenue: '₹ 15,840'
  },
  {
    id: 3,
    name: 'Smartwatch',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100',
    sold: 98,
    revenue: '₹ 29,400'
  }
]
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Top Products</h3>
      <a href="/inventory" class="text-sm text-primary-600 hover:underline dark:text-primary-400">View all</a>
    </div>
    
    <div class="space-y-4">
      <div v-for="product in topProducts" :key="product.id" class="flex items-center">
        <img :src="product.image" :alt="product.name" class="w-12 h-12 object-cover rounded-lg" />
        
        <div class="ml-4 flex-1">
          <h4 class="text-sm font-medium text-gray-800 dark:text-white">{{ product.name }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ product.sold }} sold</p>
        </div>
        
        <div class="text-right">
          <p class="text-sm font-semibold text-gray-800 dark:text-white">{{ product.revenue }}</p>
        </div>
      </div>
    </div>
  </div>
</template>