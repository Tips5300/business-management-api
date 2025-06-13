<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '../components/pos/SearchInput.vue'

// Mock data for inventory items
const inventory = ref([
  {
    id: 1,
    name: 'Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    cost: 1500,
    price: 2499,
    quantity: 45,
    reorderThreshold: 10,
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 2,
    name: "Men's T-Shirt",
    sku: 'TS-001',
    category: 'Clothing',
    cost: 400,
    price: 799,
    quantity: 8,
    reorderThreshold: 15,
    image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: 3,
    name: 'Smartphone Charger',
    sku: 'SC-001',
    category: 'Electronics',
    cost: 300,
    price: 599,
    quantity: 60,
    reorderThreshold: 20,
    image: 'https://images.pexels.com/photos/4526482/pexels-photo-4526482.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
])

const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Home']
const isAddProductModalOpen = ref(false)
const editingProduct = ref<any>(null)

// New product form data
const newProduct = ref({
  name: '',
  sku: '',
  category: '',
  cost: 0,
  price: 0,
  quantity: 0,
  reorderThreshold: 0,
  image: ''
})

const filteredInventory = computed(() => {
  return inventory.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || item.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const openAddProductModal = () => {
  editingProduct.value = null
  newProduct.value = {
    name: '',
    sku: '',
    category: '',
    cost: 0,
    price: 0,
    quantity: 0,
    reorderThreshold: 0,
    image: ''
  }
  isAddProductModalOpen.value = true
}

const openEditProductModal = (product: any) => {
  editingProduct.value = product
  newProduct.value = { ...product }
  isAddProductModalOpen.value = true
}

const saveProduct = () => {
  if (editingProduct.value) {
    // Update existing product
    const index = inventory.value.findIndex(p => p.id === editingProduct.value.id)
    if (index !== -1) {
      inventory.value[index] = { ...editingProduct.value, ...newProduct.value }
    }
  } else {
    // Add new product
    inventory.value.push({
      id: inventory.value.length + 1,
      ...newProduct.value
    })
  }
  isAddProductModalOpen.value = false
}

const deleteProduct = (productId: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    inventory.value = inventory.value.filter(p => p.id !== productId)
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
            placeholder="Search by name or SKU..." 
          />
        </div>
        
        <div class="flex items-center gap-4">
          <select 
            v-model="selectedCategory"
            class="form-select"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          
          <button 
            type="button"
            class="btn btn-primary"
            @click="openAddProductModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </button>
        </div>
      </div>
    </div>
    
    <!-- Inventory Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Product</th>
            <th scope="col" class="px-6 py-3">SKU</th>
            <th scope="col" class="px-6 py-3">Category</th>
            <th scope="col" class="px-6 py-3">Cost</th>
            <th scope="col" class="px-6 py-3">Price</th>
            <th scope="col" class="px-6 py-3">Quantity</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredInventory" :key="product.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img :src="product.image" :alt="product.name" class="w-10 h-10 rounded-lg object-cover mr-3" />
                <span class="font-medium text-gray-900 dark:text-white">{{ product.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">{{ product.sku }}</td>
            <td class="px-6 py-4">{{ product.category }}</td>
            <td class="px-6 py-4">₹ {{ product.cost }}</td>
            <td class="px-6 py-4">₹ {{ product.price }}</td>
            <td class="px-6 py-4">{{ product.quantity }}</td>
            <td class="px-6 py-4">
              <span 
                class="badge"
                :class="product.quantity <= product.reorderThreshold ? 'badge-red' : 'badge-green'"
              >
                {{ product.quantity <= product.reorderThreshold ? 'Low Stock' : 'In Stock' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center space-x-3">
                <button 
                  type="button"
                  class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  @click="openEditProductModal(product)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button 
                  type="button"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  @click="deleteProduct(product.id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div v-if="isAddProductModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ editingProduct ? 'Edit Product' : 'Add New Product' }}
        </h3>
        
        <form @submit.prevent="saveProduct" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input 
                type="text" 
                v-model="newProduct.name"
                class="form-input"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <input 
                type="text" 
                v-model="newProduct.sku"
                class="form-input"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select 
                v-model="newProduct.category"
                class="form-select"
                required
              >
                <option value="">Select category</option>
                <option v-for="category in categories.filter(c => c !== 'All')" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cost Price
              </label>
              <input 
                type="number" 
                v-model="newProduct.cost"
                class="form-input"
                min="0"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Selling Price
              </label>
              <input 
                type="number" 
                v-model="newProduct.price"
                class="form-input"
                min="0"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input 
                type="number" 
                v-model="newProduct.quantity"
                class="form-input"
                min="0"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reorder Threshold
              </label>
              <input 
                type="number" 
                v-model="newProduct.reorderThreshold"
                class="form-input"
                min="0"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input 
                type="url" 
                v-model="newProduct.image"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              class="btn btn-outline"
              @click="isAddProductModalOpen = false"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary"
            >
              {{ editingProduct ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>