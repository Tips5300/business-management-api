<script setup lang="ts">
import { ref, computed } from 'vue'
import SearchInput from '../components/pos/SearchInput.vue'
import CategoryFilter from '../components/pos/CategoryFilter.vue'
import ProductCard from '../components/pos/ProductCard.vue'

// Mock data
const categories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Home']
const selectedCategory = ref('All')
const searchQuery = ref('')

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: '₹ 2,499',
    image: 'https://images.pexels.com/photos/3945667/pexels-photo-3945667.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Men\'s T-Shirt',
    price: '₹ 799',
    image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Clothing'
  },
  {
    id: 3,
    name: 'Smartphone Charger',
    price: '₹ 599',
    image: 'https://images.pexels.com/photos/4526482/pexels-photo-4526482.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Coffee Mug',
    price: '₹ 299',
    image: 'https://images.pexels.com/photos/1207918/pexels-photo-1207918.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Home'
  },
  {
    id: 5,
    name: 'Novel - The Silent Patient',
    price: '₹ 399',
    image: 'https://images.pexels.com/photos/3747163/pexels-photo-3747163.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Books'
  },
  {
    id: 6,
    name: 'Women\'s Handbag',
    price: '₹ 1,299',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Clothing'
  },
  {
    id: 7,
    name: 'Chocolate Box',
    price: '₹ 449',
    image: 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Food'
  },
  {
    id: 8,
    name: 'Smartwatch',
    price: '₹ 3,499',
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    category: 'Electronics'
  }
]

// Cart state
const cart = ref<Array<{
  id: number,
  name: string,
  price: string,
  image: string,
  quantity: number
}>>([])

const isPaymentModalOpen = ref(false)
const isCashModalOpen = ref(false)
const isReceiptModalOpen = ref(false)
const cashAmount = ref('')
const paymentMethod = ref('')

// Filtered products based on search and category
const filteredProducts = computed(() => {
  return products.filter(product => {
    const matchesCategory = selectedCategory.value === 'All' || product.category === selectedCategory.value
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

// Cart operations
const addToCart = (product: any) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }
}

const removeFromCart = (itemId: number) => {
  cart.value = cart.value.filter(item => item.id !== itemId)
}

const updateQuantity = (itemId: number, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeFromCart(itemId)
    return
  }
  
  const item = cart.value.find(item => item.id === itemId)
  if (item) {
    item.quantity = newQuantity
  }
}

// Calculate totals
const cartTotal = computed(() => {
  const totalRaw = cart.value.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₹ ', '').replace(',', ''))
    return sum + (price * item.quantity)
  }, 0)
  
  return totalRaw.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
})

const subtotal = computed(() => {
  const subtotalRaw = cart.value.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₹ ', '').replace(',', ''))
    return sum + (price * item.quantity)
  }, 0)
  
  return subtotalRaw.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
})

const tax = computed(() => {
  const taxRate = 0.18 // 18% GST
  const subtotalRaw = cart.value.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₹ ', '').replace(',', ''))
    return sum + (price * item.quantity)
  }, 0)
  
  const taxAmount = subtotalRaw * taxRate
  
  return taxAmount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  })
})

// Payment handling
const openCashModal = () => {
  isCashModalOpen.value = true
}

const openPaymentModal = () => {
  isPaymentModalOpen.value = true
}

const processPayment = () => {
  if (isCashModalOpen.value) {
    // Process cash payment
    paymentMethod.value = 'Cash'
  } else {
    // Process card payment
    paymentMethod.value = 'Card'
  }
  
  isCashModalOpen.value = false
  isPaymentModalOpen.value = false
  isReceiptModalOpen.value = true
}

const finishTransaction = () => {
  // Clear cart and close modals
  cart.value = []
  isReceiptModalOpen.value = false
  cashAmount.value = ''
  paymentMethod.value = ''
}

const calculateChange = computed(() => {
  if (!cashAmount.value) return '₹ 0'
  
  const cashAmountValue = parseFloat(cashAmount.value)
  const totalValue = parseFloat(cartTotal.value.replace('₹', '').replace(',', ''))
  
  const change = cashAmountValue - totalValue
  
  return change <= 0 
    ? '₹ 0' 
    : change.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      })
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
}
</script>

<template>
  <div class="h-full">
    <!-- Two column layout: Products | Cart -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <!-- Products section (left side) -->
      <div class="lg:col-span-2 space-y-4">
        <div class="card">
          <!-- Search and filters -->
          <div class="mb-4">
            <SearchInput v-model="searchQuery" placeholder="Search products..." />
          </div>
          
          <!-- Categories -->
          <CategoryFilter 
            :categories="categories" 
            :selected-category="selectedCategory"
            @select-category="selectCategory"
          />
          
          <!-- Products grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product"
              @add-to-cart="addToCart"
            />
          </div>
        </div>
      </div>
      
      <!-- Cart section (right side) -->
      <div class="lg:col-span-1">
        <div class="card h-full flex flex-col">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Shopping Cart</h2>
          
          <!-- Empty cart state -->
          <div v-if="cart.length === 0" class="flex-1 flex flex-col items-center justify-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <p class="text-gray-500 dark:text-gray-400">Your cart is empty</p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Add products to start a new sale</p>
          </div>
          
          <!-- Cart items -->
          <div v-else class="flex-1 overflow-y-auto">
            <div class="space-y-3">
              <div v-for="item in cart" :key="item.id" class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <img :src="item.image" :alt="item.name" class="w-12 h-12 object-cover rounded-md" />
                
                <div class="ml-3 flex-1">
                  <h4 class="text-sm font-medium text-gray-800 dark:text-white truncate">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ item.price }}</p>
                </div>
                
                <div class="flex items-center">
                  <button 
                    type="button"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    @click="updateQuantity(item.id, item.quantity - 1)"
                    aria-label="Decrease quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  
                  <span class="mx-2 w-6 text-center text-sm">{{ item.quantity }}</span>
                  
                  <button 
                    type="button"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    @click="updateQuantity(item.id, item.quantity + 1)"
                    aria-label="Increase quantity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  
                  <button 
                    type="button"
                    class="ml-3 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    @click="removeFromCart(item.id)"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cart summary -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="font-medium text-gray-800 dark:text-white">{{ subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm mb-4">
              <span class="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
              <span class="font-medium text-gray-800 dark:text-white">{{ tax }}</span>
            </div>
            <div class="flex justify-between font-semibold text-lg mb-6">
              <span class="text-gray-800 dark:text-white">Total</span>
              <span class="text-primary-600 dark:text-primary-400">{{ cartTotal }}</span>
            </div>
            
            <!-- Payment buttons -->
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button"
                class="btn btn-primary py-3"
                :disabled="cart.length === 0"
                :class="{'opacity-50 cursor-not-allowed': cart.length === 0}"
                @click="openCashModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                Cash Payment
              </button>
              
              <button 
                type="button"
                class="btn btn-secondary py-3"
                :disabled="cart.length === 0"
                :class="{'opacity-50 cursor-not-allowed': cart.length === 0}"
                @click="openPaymentModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                Card/Mobile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Cash Payment Modal -->
    <div v-if="isCashModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Cash Payment</h3>
        
        <div class="mb-4">
          <label for="cashAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount Received
          </label>
          <input 
            type="number" 
            id="cashAmount" 
            class="form-input"
            v-model="cashAmount"
            placeholder="Enter amount"
          />
        </div>
        
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600 dark:text-gray-400">Total Amount</span>
            <span class="font-medium text-gray-800 dark:text-white">{{ cartTotal }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Change</span>
            <span class="font-medium text-gray-800 dark:text-white">{{ calculateChange }}</span>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            class="btn btn-outline"
            @click="isCashModalOpen = false"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            class="btn btn-primary"
            :disabled="!cashAmount || parseFloat(cashAmount) < parseFloat(cartTotal.replace('₹', '').replace(',', ''))"
            :class="{'opacity-50 cursor-not-allowed': !cashAmount || parseFloat(cashAmount) < parseFloat(cartTotal.replace('₹', '').replace(',', ''))}"
            @click="processPayment"
          >
            Complete Payment
          </button>
        </div>
      </div>
    </div>
    
    <!-- Card/Mobile Payment Modal -->
    <div v-if="isPaymentModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Card/Mobile Payment</h3>
        
        <div class="mb-6">
          <p class="text-gray-600 dark:text-gray-400 mb-2">Please swipe card or scan QR code to complete payment.</p>
          
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-gray-400 dark:text-gray-500 mb-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
            <p class="text-sm text-gray-500 dark:text-gray-400">Total: {{ cartTotal }}</p>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button 
            type="button"
            class="btn btn-outline"
            @click="isPaymentModalOpen = false"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            class="btn btn-primary"
            @click="processPayment"
          >
            Payment Received
          </button>
        </div>
      </div>
    </div>
    
    <!-- Receipt Modal -->
    <div v-if="isReceiptModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="text-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto text-green-500 mb-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-800 dark:text-white">Payment Successful!</h3>
        </div>
        
        <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
          <div class="text-center mb-4">
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">BusinessPro</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">Receipt #{{ Math.floor(Math.random() * 10000) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ new Date().toLocaleString() }}</p>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mb-3">
            <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm mb-2">
              <span class="text-gray-600 dark:text-gray-400">{{ item.name }} × {{ item.quantity }}</span>
              <span class="text-gray-800 dark:text-white">{{ item.price }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="text-gray-800 dark:text-white">{{ subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-gray-600 dark:text-gray-400">Tax (18% GST)</span>
              <span class="text-gray-800 dark:text-white">{{ tax }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-gray-800 dark:text-white">Total</span>
              <span class="text-gray-800 dark:text-white">{{ cartTotal }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-400">Payment Method: {{ paymentMethod }}</p>
            <p v-if="paymentMethod === 'Cash'" class="text-sm text-gray-600 dark:text-gray-400">
              Amount Received: ₹ {{ cashAmount }}
            </p>
            <p v-if="paymentMethod === 'Cash'" class="text-sm text-gray-600 dark:text-gray-400">
              Change: {{ calculateChange }}
            </p>
          </div>
        </div>
        
        <div class="flex justify-between">
          <button 
            type="button"
            class="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
            </svg>
            Print Receipt
          </button>
          
          <button 
            type="button"
            class="btn btn-primary"
            @click="finishTransaction"
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  </div>
</template>