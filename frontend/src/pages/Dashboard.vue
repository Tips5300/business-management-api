<script setup lang="ts">
import SummaryCard from '../components/dashboard/SummaryCard.vue'
import SalesChart from '../components/dashboard/SalesChart.vue'
import TopProducts from '../components/dashboard/TopProducts.vue'
import InventoryChart from '../components/dashboard/InventoryChart.vue'
</script>

<template>
  <div class="space-y-6">
    <!-- Header Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Sales"
        value="₹ 48,254"
        trend="+12.5% from last month"
        trendType="up"
        icon="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        color="blue"
      />
      
      <SummaryCard
        title="Total Customers"
        value="184"
        trend="+3.2% from last month"
        trendType="up"
        icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        color="green"
      />
      
      <SummaryCard
        title="Inventory Items"
        value="246"
        trend="5 items low in stock"
        trendType="down"
        icon="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
        color="orange"
      />
      
      <SummaryCard
        title="Pending Orders"
        value="12"
        trend="Updated just now"
        trendType="neutral"
        icon="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
        color="purple"
      />
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SalesChart title="Sales Over Time" />
      <InventoryChart />
    </div>
    
    <!-- Additional Data -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TopProducts />
      
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Recent Activities</h3>
        </div>
        
        <div class="space-y-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">New invoice created</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Invoice #INV-2023 for Customer 'ABC Corp'</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">10 minutes ago</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">Payment received</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">₹ 12,500 from 'XYZ Industries'</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">New product added</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Added 15 units of 'Bluetooth Speaker'</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
            </div>
          </div>
          
          <div class="flex">
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">New customer registered</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">John Doe (john.doe@example.com)</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>