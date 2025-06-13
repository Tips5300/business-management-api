<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartRef = ref<HTMLCanvasElement | null>(null)

// Mock data
const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Home']
const inStock = [45, 35, 20, 30, 25]
const lowStock = [5, 8, 2, 3, 5]

let chart: Chart | null = null

onMounted(() => {
  if (!chartRef.value) return
  
  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categories,
      datasets: [
        {
          label: 'In Stock',
          data: inStock,
          backgroundColor: '#4f46e5',
          borderRadius: 6
        },
        {
          label: 'Low Stock',
          data: lowStock,
          backgroundColor: '#f97316',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: 'rgba(226, 232, 240, 0.6)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Inventory Status</h3>
      <a href="/inventory" class="text-sm text-primary-600 hover:underline dark:text-primary-400">View all</a>
    </div>
    
    <div class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>