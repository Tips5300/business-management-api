import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import pages
import Dashboard from './pages/Dashboard.vue'
import POS from './pages/POS.vue'
import Inventory from './pages/Inventory.vue'
import Customers from './pages/Customers.vue'
import Staff from './pages/Staff.vue'
import Invoices from './pages/Invoices.vue'
import Settings from './pages/Settings.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import ForgotPassword from './pages/ForgotPassword.vue'

// Import Flowbite
import 'flowbite'

// Configure routes
const routes = [
  { path: '/', component: Dashboard },
  { path: '/pos', component: POS },
  { path: '/inventory', component: Inventory },
  { path: '/customers', component: Customers },
  { path: '/staff', component: Staff },
  { path: '/invoices', component: Invoices },
  { path: '/settings', component: Settings },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/forgot-password', component: ForgotPassword },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
  .use(router)
  .mount('#app')