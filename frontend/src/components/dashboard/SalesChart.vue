<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps<{
  title: string
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
const timeRange = ref<'daily' | 'weekly' | 'monthly'>('weekly')

// Mock data
const dailyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  values: [1200, 1900, 1500, 2500, 2200, 3100, 2800]
}

const weeklyData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  values: [10500, 12800, 14200, 15800]
}

const monthlyData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  values: [42000, 38000, 45000, 50000, 52000, 60000]
}

let chart: Chart | null = null

const createChart = () => {
  if (!chartRef.value) return
  
  const ctx = chartRef.value.getContext('2d')
  if (!ctx) return
  
  // Destroy previous chart if it exists
  if (chart) chart.destroy()
  
  // Get data based on selected time range
  const data = timeRange.value === 'daily' 
    ? dailyData 
    : timeRange.value === 'weekly' 
      ? weeklyData 
      : monthlyData
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: 'Sales',
        data: data.values,
        fill: false,
        borderColor: '#4f46e5',
        tension: 0.1,
        borderWidth: 2,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1f2937',
          titleColor: '#f9fafb',
          bodyColor: '#f9fafb',
          bodyFont: {
            size: 13
          },
          displayColors: false,
          callbacks: {
            label: (context) => {
              return `₹ ${context.raw}`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false,
            color: 'rgba(226, 232, 240, 0.6)'
          },
          ticks: {
            callback: (value) => {
              return `₹ ${value}`
            }
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
}

const changeTimeRange = (range: 'daily' | 'weekly' | 'monthly') => {
  timeRange.value = range
  createChart()
}

onMounted(() => {
  createChart()
})
</script>

<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h3>
      
      <div class="flex items-center space-x-2 text-sm">
        <button 
          type="button"
          class="px-3 py-1 rounded-md transition-colors duration-150"
          :class="timeRange === 'daily' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          @click="changeTimeRange('daily')"
        >
          Daily
        </button>
        <button 
          type="button"
          class="px-3 py-1 rounded-md transition-colors duration-150"
          :class="timeRange === 'weekly' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          @click="changeTimeRange('weekly')"
        >
          Weekly
        </button>
        <button 
          type="button"
          class="px-3 py-1 rounded-md transition-colors duration-150"
          :class="timeRange === 'monthly' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          @click="changeTimeRange('monthly')"
        >
          Monthly
        </button>
      </div>
    </div>
    
    <div class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>