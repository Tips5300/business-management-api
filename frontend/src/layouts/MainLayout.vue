<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '../components/navigation/Sidebar.vue'
import TopNavbar from '../components/navigation/TopNavbar.vue'
import MobileNavbar from '../components/navigation/MobileNavbar.vue'

const router = useRouter()
const isSidebarOpen = ref(true)
const currentRoute = computed(() => router.currentRoute.value.path)
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/pos': 'Point of Sale',
    '/inventory': 'Inventory Management',
    '/customers': 'Customer Management',
    '/staff': 'Staff Management',
    '/invoices': 'Invoices & Accounting',
    '/settings': 'Settings'
  }
  return titles[currentRoute.value] || 'Dashboard'
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar for desktop and tablet -->
    <Sidebar :is-open="isSidebarOpen" />
    
    <!-- Main content area -->
    <div 
      class="transition-all duration-300"
      :class="isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'"
    >
      <!-- Top Navbar -->
      <TopNavbar :title="pageTitle" @toggle-sidebar="toggleSidebar" />
      
      <!-- Main Content -->
      <main class="p-4 md:p-6">
        <router-view />
      </main>
      
      <!-- Footer -->
      <footer class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {{ new Date().getFullYear() }} Local Business Management Software. All rights reserved.</p>
      </footer>
    </div>
    
    <!-- Mobile bottom navigation -->
    <MobileNavbar />
  </div>
</template>