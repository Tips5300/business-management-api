<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '../components/pos/SearchInput.vue'

// Mock data for customers
const customers = ref([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    totalSpent: 12500,
    tag: 'VIP',
    joinDate: '2023-01-15',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+91 98765 43211',
    totalSpent: 8750,
    tag: 'Regular',
    joinDate: '2023-03-20',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    phone: '+91 98765 43212',
    totalSpent: 2500,
    tag: 'New',
    joinDate: '2023-11-05',
    avatar: 'https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
])

const searchQuery = ref('')
const selectedTag = ref('All')
const tags = ['All', 'VIP', 'Regular', 'New']
const isAddCustomerModalOpen = ref(false)
const isViewCustomerModalOpen = ref(false)
const editingCustomer = ref<any>(null)
const viewingCustomer = ref<any>(null)

// New customer form data
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  tag: 'New',
  avatar: ''
})

// Mock purchase history
const purchaseHistory = [
  {
    id: 1,
    date: '2023-12-01',
    items: ['Wireless Headphones', 'Smartphone Charger'],
    total: 3098
  },
  {
    id: 2,
    date: '2023-11-15',
    items: ['Men\'s T-Shirt', 'Coffee Mug'],
    total: 1098
  },
  {
    id: 3,
    date: '2023-11-01',
    items: ['Novel - The Silent Patient'],
    total: 399
  }
]

const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesTag = selectedTag.value === 'All' || customer.tag === selectedTag.value
    return matchesSearch && matchesTag
  })
})

const openAddCustomerModal = () => {
  editingCustomer.value = null
  newCustomer.value = {
    name: '',
    email: '',
    phone: '',
    tag: 'New',
    avatar: ''
  }
  isAddCustomerModalOpen.value = true
}

const openEditCustomerModal = (customer: any) => {
  editingCustomer.value = customer
  newCustomer.value = { ...customer }
  isAddCustomerModalOpen.value = true
}

const openViewCustomerModal = (customer: any) => {
  viewingCustomer.value = customer
  isViewCustomerModalOpen.value = true
}

const saveCustomer = () => {
  if (editingCustomer.value) {
    // Update existing customer
    const index = customers.value.findIndex(c => c.id === editingCustomer.value.id)
    if (index !== -1) {
      customers.value[index] = {
        ...editingCustomer.value,
        ...newCustomer.value
      }
    }
  } else {
    // Add new customer
    customers.value.push({
      id: customers.value.length + 1,
      ...newCustomer.value,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0]
    })
  }
  isAddCustomerModalOpen.value = false
}

const getTagClass = (tag: string) => {
  switch (tag) {
    case 'VIP':
      return 'badge-green'
    case 'Regular':
      return 'badge-blue'
    case 'New':
      return 'badge-yellow'
    default:
      return 'badge-gray'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toolbar -->
    <div class="card">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1">
          <SearchInput 
            v-model="searchQuery" 
            placeholder="Search customers..." 
          />
        </div>
        
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedTag"
            class="form-select"
          >
            <option v-for="tag in tags" :key="tag" :value="tag">
              {{ tag }}
            </option>
          </select>
          
          <button 
            type="button"
            class="btn btn-primary"
            @click="openAddCustomerModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>
    </div>
    
    <!-- Customers Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Customer</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Phone</th>
            <th scope="col" class="px-6 py-3">Total Spent</th>
            <th scope="col" class="px-6 py-3">Tag</th>
            <th scope="col" class="px-6 py-3">Join Date</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img :src="customer.avatar" :alt="customer.name" class="w-10 h-10 rounded-full object-cover mr-3" />
                <span class="font-medium text-gray-900 dark:text-white">{{ customer.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">{{ customer.email }}</td>
            <td class="px-6 py-4">{{ customer.phone }}</td>
            <td class="px-6 py-4">₹ {{ customer.totalSpent }}</td>
            <td class="px-6 py-4">
              <span :class="['badge', getTagClass(customer.tag)]">
                {{ customer.tag }}
              </span>
            </td>
            <td class="px-6 py-4">{{ customer.joinDate }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  @click="openViewCustomerModal(customer)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  @click="openEditCustomerModal(customer)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add/Edit Customer Modal -->
    <div v-if="isAddCustomerModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}
        </h3>
        
        <form @submit.prevent="saveCustomer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input 
              type="text" 
              v-model="newCustomer.name"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input 
              type="email" 
              v-model="newCustomer.email"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input 
              type="tel" 
              v-model="newCustomer.phone"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tag
            </label>
            <select 
              v-model="newCustomer.tag"
              class="form-select"
              required
            >
              <option v-for="tag in tags.filter(t => t !== 'All')" :key="tag" :value="tag">
                {{ tag }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input 
              type="url" 
              v-model="newCustomer.avatar"
              class="form-input"
              required
            />
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              class="btn btn-outline"
              @click="isAddCustomerModalOpen = false"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary"
            >
              {{ editingCustomer ? 'Update Customer' : 'Add Customer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- View Customer Modal -->
    <div v-if="isViewCustomerModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center">
            <img 
              :src="viewingCustomer?.avatar" 
              :alt="viewingCustomer?.name"
              class="w-16 h-16 rounded-full object-cover mr-4"
            />
            <div>
              <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
                {{ viewingCustomer?.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Customer since {{ viewingCustomer?.joinDate }}
              </p>
            </div>
          </div>
          
          <button 
            type="button"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            @click="isViewCustomerModalOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Information</h4>
            <div class="space-y-2">
              <p class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Email:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ viewingCustomer?.email }}</span>
              </p>
              <p class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Phone:</span>
                <span class="ml-2 text-gray-900 dark:text-white">{{ viewingCustomer?.phone }}</span>
              </p>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Status</h4>
            <div class="space-y-2">
              <p class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Total Spent:</span>
                <span class="ml-2 text-gray-900 dark:text-white">₹ {{ viewingCustomer?.totalSpent }}</span>
              </p>
              <p class="text-sm">
                <span class="text-gray-500 dark:text-gray-400">Status:</span>
                <span 
                  class="ml-2 badge"
                  :class="getTagClass(viewingCustomer?.tag)"
                >
                  {{ viewingCustomer?.tag }}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Purchase History</h4>
          <div class="space-y-4">
            <div v-for="purchase in purchaseHistory" :key="purchase.id" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ purchase.items.join(', ') }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ purchase.date }}
                  </p>
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  ₹ {{ purchase.total }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>