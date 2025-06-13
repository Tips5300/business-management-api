<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '../components/pos/SearchInput.vue'

// Mock data for invoices
const invoices = ref([
  {
    id: 'INV-2023-001',
    customer: 'John Doe',
    dateIssued: '2023-12-01',
    dueDate: '2023-12-15',
    amount: 3098,
    status: 'Paid',
    items: [
      { description: 'Wireless Headphones', quantity: 1, price: 2499 },
      { description: 'Smartphone Charger', quantity: 1, price: 599 }
    ]
  },
  {
    id: 'INV-2023-002',
    customer: 'Jane Smith',
    dateIssued: '2023-12-05',
    dueDate: '2023-12-19',
    amount: 1098,
    status: 'Unpaid',
    items: [
      { description: 'Men\'s T-Shirt', quantity: 1, price: 799 },
      { description: 'Coffee Mug', quantity: 1, price: 299 }
    ]
  },
  {
    id: 'INV-2023-003',
    customer: 'Mike Johnson',
    dateIssued: '2023-11-15',
    dueDate: '2023-11-29',
    amount: 399,
    status: 'Overdue',
    items: [
      { description: 'Novel - The Silent Patient', quantity: 1, price: 399 }
    ]
  }
])

const searchQuery = ref('')
const selectedStatus = ref('All')
const statuses = ['All', 'Paid', 'Unpaid', 'Overdue']
const isCreateInvoiceModalOpen = ref(false)
const isViewInvoiceModalOpen = ref(false)
const viewingInvoice = ref<any>(null)

// New invoice form data
const newInvoice = ref({
  customer: '',
  dueDate: '',
  items: [{ description: '', quantity: 1, price: 0 }]
})

const customers = [
  'John Doe',
  'Jane Smith',
  'Mike Johnson',
  'Sarah Williams',
  'David Brown'
]

const filteredInvoices = computed(() => {
  return invoices.value.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || invoice.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const subtotal = computed(() => {
  return newInvoice.value.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
})

const tax = computed(() => {
  return subtotal.value * 0.18 // 18% GST
})

const total = computed(() => {
  return subtotal.value + tax.value
})

const openCreateInvoiceModal = () => {
  newInvoice.value = {
    customer: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }]
  }
  isCreateInvoiceModalOpen.value = true
}

const openViewInvoiceModal = (invoice: any) => {
  viewingInvoice.value = invoice
  isViewInvoiceModalOpen.value = true
}

const addInvoiceItem = () => {
  newInvoice.value.items.push({ description: '', quantity: 1, price: 0 })
}

const removeInvoiceItem = (index: number) => {
  newInvoice.value.items.splice(index, 1)
}

const saveInvoice = () => {
  const invoice = {
    id: `INV-${new Date().getFullYear()}-${(invoices.value.length + 1).toString().padStart(3, '0')}`,
    customer: newInvoice.value.customer,
    dateIssued: new Date().toISOString().split('T')[0],
    dueDate: newInvoice.value.dueDate,
    amount: total.value,
    status: 'Unpaid',
    items: newInvoice.value.items
  }
  
  invoices.value.push(invoice)
  isCreateInvoiceModalOpen.value = false
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'badge-green'
    case 'Unpaid':
      return 'badge-yellow'
    case 'Overdue':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
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
            placeholder="Search invoices..." 
          />
        </div>
        
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedStatus"
            class="form-select"
          >
            <option v-for="status in statuses" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          
          <button 
            type="button"
            class="btn btn-primary"
            @click="openCreateInvoiceModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Invoice
          </button>
        </div>
      </div>
    </div>
    
    <!-- Invoices Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Invoice #</th>
            <th scope="col" class="px-6 py-3">Customer</th>
            <th scope="col" class="px-6 py-3">Date Issued</th>
            <th scope="col" class="px-6 py-3">Due Date</th>
            <th scope="col" class="px-6 py-3">Amount</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in filteredInvoices" :key="invoice.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
              {{ invoice.id }}
            </td>
            <td class="px-6 py-4">{{ invoice.customer }}</td>
            <td class="px-6 py-4">{{ invoice.dateIssued }}</td>
            <td class="px-6 py-4">{{ invoice.dueDate }}</td>
            <td class="px-6 py-4">₹ {{ invoice.amount }}</td>
            <td class="px-6 py-4">
              <span :class="['badge', getStatusClass(invoice.status)]">
                {{ invoice.status }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  @click="openViewInvoiceModal(invoice)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Create Invoice Modal -->
    <div v-if="isCreateInvoiceModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          Create New Invoice
        </h3>
        
        <form @submit.prevent="saveInvoice" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Customer
              </label>
              <select 
                v-model="newInvoice.customer"
                class="form-select"
                required
              >
                <option value="">Select customer</option>
                <option v-for="customer in customers" :key="customer" :value="customer">
                  {{ customer }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input 
                type="date" 
                v-model="newInvoice.dueDate"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <!-- Invoice Items -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-lg font-medium text-gray-800 dark:text-white">Items</h4>
              <button 
                type="button"
                class="btn btn-outline"
                @click="addInvoiceItem"
              >
                Add Item
              </button>
            </div>
            
            <div class="space-y-4">
              <div v-for="(item, index) in newInvoice.items" :key="index" class="flex items-start space-x-4">
                <div class="flex-1">
                  <input 
                    type="text" 
                    v-model="item.description"
                    class="form-input"
                    placeholder="Item description"
                    required
                  />
                </div>
                
                <div class="w-24">
                  <input 
                    type="number" 
                    v-model="item.quantity"
                    class="form-input"
                    min="1"
                    required
                  />
                </div>
                
                <div class="w-32">
                  <input 
                    type="number" 
                    v-model="item.price"
                    class="form-input"
                    min="0"
                    required
                  />
                </div>
                
                <div class="w-32 text-right">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(item.quantity * item.price) }}
                  </p>
                </div>
                
                <button 
                  type="button"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  @click="removeInvoiceItem(index)"
                  :disabled="newInvoice.items.length === 1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Invoice Summary -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-end">
              <div class="w-64 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(tax) }}</span>
                </div>
                <div class="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span class="text-gray-900 dark:text-white">Total</span>
                  <span class="text-primary-600 dark:text-primary-400">{{ formatCurrency(total) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              class="btn btn-outline"
              @click="isCreateInvoiceModalOpen = false"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- View Invoice Modal -->
    <div v-if="isViewInvoiceModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
              Invoice {{ viewingInvoice?.id }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Issued on {{ viewingInvoice?.dateIssued }}
            </p>
          </div>
          
          <button 
            type="button"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            @click="isViewInvoiceModalOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bill To</h4>
            <p class="text-sm text-gray-900 dark:text-white">{{ viewingInvoice?.customer }}</p>
          </div>
          
          <div class="text-right">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h4>
            <span 
              :class="['badge', getStatusClass(viewingInvoice?.status)]"
            >
              {{ viewingInvoice?.status }}
            </span>
          </div>
        </div>
        
        <div class="border rounded-lg overflow-hidden mb-6">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2 text-gray-700 dark:text-gray-300">Item</th>
                <th class="px-4 py-2 text-gray-700 dark:text-gray-300">Qty</th>
                <th class="px-4 py-2 text-gray-700 dark:text-gray-300">Price</th>
                <th class="px-4 py-2 text-gray-700 dark:text-gray-300 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in viewingInvoice?.items" :key="item.description">
                <td class="px-4 py-2 text-gray-900 dark:text-white">{{ item.description }}</td>
                <td class="px-4 py-2 text-gray-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-4 py-2 text-gray-900 dark:text-white">₹ {{ item.price }}</td>
                <td class="px-4 py-2 text-gray-900 dark:text-white text-right">
                  ₹ {{ item.quantity * item.price }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="font-medium text-gray-900 dark:text-white">
                ₹ {{ Math.round(viewingInvoice?.amount / 1.18) }}
              </span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
              <span class="font-medium text-gray-900 dark:text-white">
                ₹ {{ Math.round(viewingInvoice?.amount - (viewingInvoice?.amount / 1.18)) }}
              </span>
            </div>
            <div class="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
              <span class="text-gray-900 dark:text-white">Total</span>
              <span class="text-primary-600 dark:text-primary-400">₹ {{ viewingInvoice?.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>