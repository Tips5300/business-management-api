<script setup lang="ts">
import { ref } from 'vue'

// Mock data for business profile
const businessProfile = ref({
  name: 'BusinessPro',
  legalName: 'BusinessPro Technologies Pvt Ltd',
  address: '123 Business Street, Tech Park, Bangalore - 560001',
  email: 'contact@businesspro.com',
  phone: '+91 98765 43210',
  logo: 'https://images.pexels.com/photos/5473337/pexels-photo-5473337.jpeg?auto=compress&cs=tinysrgb&w=300'
})

// Tax rates
const taxRates = ref([
  { id: 1, name: 'GST 18%', rate: 18, appliesTo: 'All Products' },
  { id: 2, name: 'GST 12%', rate: 12, appliesTo: 'Food Items' },
  { id: 3, name: 'GST 5%', rate: 5, appliesTo: 'Essential Goods' }
])

// Integration settings
const integrations = ref({
  payment: {
    razorpay: { enabled: true, keyId: 'rzp_test_xxxxx' },
    stripe: { enabled: false, publishableKey: '' }
  },
  sms: {
    provider: 'MSG91',
    apiKey: '123456789',
    senderId: 'BUSPRO'
  },
  email: {
    host: 'smtp.gmail.com',
    port: 587,
    username: 'notifications@businesspro.com',
    password: '••••••••'
  }
})

// Platform preferences
const preferences = ref({
  locale: 'en-IN',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  darkMode: false
})

// Security settings
const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  gdprEnabled: true,
  dataRetention: 90
})

const isTestingEmail = ref(false)
const isTestingSMS = ref(false)
const showSuccessAlert = ref(false)
const successMessage = ref('')

const saveBusinessProfile = () => {
  // Simulate API call
  setTimeout(() => {
    showSuccessAlert.value = true
    successMessage.value = 'Business profile updated successfully'
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }, 500)
}

const testEmailConnection = () => {
  isTestingEmail.value = true
  // Simulate API call
  setTimeout(() => {
    isTestingEmail.value = false
    showSuccessAlert.value = true
    successMessage.value = 'Test email sent successfully'
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }, 2000)
}

const testSMSConnection = () => {
  isTestingSMS.value = true
  // Simulate API call
  setTimeout(() => {
    isTestingSMS.value = false
    showSuccessAlert.value = true
    successMessage.value = 'Test SMS sent successfully'
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }, 2000)
}

const changePassword = () => {
  if (security.value.newPassword !== security.value.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  
  // Simulate API call
  setTimeout(() => {
    showSuccessAlert.value = true
    successMessage.value = 'Password changed successfully'
    security.value.currentPassword = ''
    security.value.newPassword = ''
    security.value.confirmPassword = ''
    setTimeout(() => {
      showSuccessAlert.value = false
    }, 3000)
  }, 500)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success Alert -->
    <div 
      v-if="showSuccessAlert"
      class="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
      role="alert"
    >
      <span class="block sm:inline">{{ successMessage }}</span>
    </div>
    
    <!-- Business Profile -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Business Profile</h2>
      
      <form @submit.prevent="saveBusinessProfile" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Business Name
            </label>
            <input 
              type="text" 
              v-model="businessProfile.name"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Legal Name
            </label>
            <input 
              type="text" 
              v-model="businessProfile.legalName"
              class="form-input"
            />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea 
              v-model="businessProfile.address"
              rows="2"
              class="form-input"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input 
              type="email" 
              v-model="businessProfile.email"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              v-model="businessProfile.phone"
              class="form-input"
            />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Logo URL
            </label>
            <input 
              type="url" 
              v-model="businessProfile.logo"
              class="form-input"
            />
          </div>
        </div>
        
        <div class="flex justify-end">
          <button type="submit" class="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
    
    <!-- Tax Configuration -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Tax Configuration</h2>
      
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Rate (%)</th>
              <th scope="col" class="px-6 py-3">Applies To</th>
              <th scope="col" class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tax in taxRates" :key="tax.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td class="px-6 py-4">{{ tax.name }}</td>
              <td class="px-6 py-4">{{ tax.rate }}%</td>
              <td class="px-6 py-4">{{ tax.appliesTo }}</td>
              <td class="px-6 py-4">
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5  4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Integration Settings -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Integration Settings</h2>
      
      <!-- Payment Gateways -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Payment Gateways</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">Razorpay</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Accept payments via Razorpay</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="integrations.payment.razorpay.enabled"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">Stripe</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Accept payments via Stripe</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="integrations.payment.stripe.enabled"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      <!-- SMS Gateway -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">SMS Gateway</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Provider
            </label>
            <input 
              type="text" 
              v-model="integrations.sms.provider"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key
            </label>
            <input 
              type="password" 
              v-model="integrations.sms.apiKey"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sender ID
            </label>
            <input 
              type="text" 
              v-model="integrations.sms.senderId"
              class="form-input"
            />
          </div>
        </div>
        
        <button 
          type="button"
          class="btn btn-outline"
          @click="testSMSConnection"
          :disabled="isTestingSMS"
        >
          <svg v-if="isTestingSMS" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isTestingSMS ? 'Testing...' : 'Test Connection' }}
        </button>
      </div>
      
      <!-- Email SMTP -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Email SMTP</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SMTP Host
            </label>
            <input 
              type="text" 
              v-model="integrations.email.host"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Port
            </label>
            <input 
              type="number" 
              v-model="integrations.email.port"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <input 
              type="text" 
              v-model="integrations.email.username"
              class="form-input"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input 
              type="password" 
              v-model="integrations.email.password"
              class="form-input"
            />
          </div>
        </div>
        
        <button 
          type="button"
          class="btn btn-outline"
          @click="testEmailConnection"
          :disabled="isTestingEmail"
        >
          <svg v-if="isTestingEmail" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isTestingEmail ? 'Testing...' : 'Test Connection' }}
        </button>
      </div>
    </div>
    
    <!-- Platform Preferences -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Platform Preferences</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Locale
          </label>
          <select 
            v-model="preferences.locale"
            class="form-select"
          >
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">Hindi (India)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Currency
          </label>
          <select 
            v-model="preferences.currency"
            class="form-select"
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date Format
          </label>
          <select 
            v-model="preferences.dateFormat"
            class="form-select"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Format
          </label>
          <select 
            v-model="preferences.timeFormat"
            class="form-select"
          >
            <option value="12h">12 Hour</option>
            <option value="24h">24 Hour</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- Security Settings -->
    <div class="card">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-6">Security Settings</h2>
      
      <!-- Change Password -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Change Password</h3>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input 
              type="password" 
              v-model="security.currentPassword"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input 
              type="password" 
              v-model="security.newPassword"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input 
              type="password" 
              v-model="security.confirmPassword"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <button type="submit" class="btn btn-primary">
              Change Password
            </button>
          </div>
        </form>
      </div>
      
      <!-- Privacy Settings -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-white mb-4">Privacy Settings</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-800 dark:text-white">GDPR Compliance</h4>
              <p class="text-xs text-gray-500 dark:text-gray-400">Enable customer data export and deletion</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="security.gdprEnabled"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data Retention Period (days)
            </label>
            <input 
              type="number" 
              v-model="security.dataRetention"
              class="form-input"
              min="30"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>