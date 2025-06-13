<script setup lang="ts">
import { ref } from 'vue'

// Mock data for staff members
const staff = ref([
  {
    id: 1,
    name: 'John Doe',
    role: 'Admin',
    email: 'john.doe@example.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Manager',
    email: 'jane.smith@example.com',
    isActive: true,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Cashier',
    email: 'mike.johnson@example.com',
    isActive: false,
    avatar: 'https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
])

const isAddStaffModalOpen = ref(false)
const editingStaff = ref<any>(null)

// New staff form data
const newStaff = ref({
  name: '',
  role: '',
  email: '',
  password: '',
  avatar: ''
})

const roles = ['Admin', 'Manager', 'Cashier']

const openAddStaffModal = () => {
  editingStaff.value = null
  newStaff.value = {
    name: '',
    role: '',
    email: '',
    password: '',
    avatar: ''
  }
  isAddStaffModalOpen.value = true
}

const openEditStaffModal = (member: any) => {
  editingStaff.value = member
  newStaff.value = { ...member, password: '' }
  isAddStaffModalOpen.value = true
}

const saveStaff = () => {
  if (editingStaff.value) {
    // Update existing staff
    const index = staff.value.findIndex(s => s.id === editingStaff.value.id)
    if (index !== -1) {
      staff.value[index] = { 
        ...editingStaff.value, 
        ...newStaff.value,
        password: undefined // Don't store password in mock data
      }
    }
  } else {
    // Add new staff
    staff.value.push({
      id: staff.value.length + 1,
      ...newStaff.value,
      isActive: true,
      password: undefined // Don't store password in mock data
    })
  }
  isAddStaffModalOpen.value = false
}

const toggleStaffStatus = (staffId: number) => {
  const index = staff.value.findIndex(s => s.id === staffId)
  if (index !== -1) {
    staff.value[index].isActive = !staff.value[index].isActive
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toolbar -->
    <div class="card">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Staff Management</h2>
        <button 
          type="button"
          class="btn btn-primary"
          @click="openAddStaffModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Add Staff
        </button>
      </div>
    </div>
    
    <!-- Staff Table -->
    <div class="card overflow-x-auto">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">Staff Member</th>
            <th scope="col" class="px-6 py-3">Role</th>
            <th scope="col" class="px-6 py-3">Email</th>
            <th scope="col" class="px-6 py-3">Status</th>
            <th scope="col" class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in staff" :key="member.id" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-6 py-4">
              <div class="flex items-center">
                <img :src="member.avatar" :alt="member.name" class="w-10 h-10 rounded-full object-cover mr-3" />
                <span class="font-medium text-gray-900 dark:text-white">{{ member.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4">{{ member.role }}</td>
            <td class="px-6 py-4">{{ member.email }}</td>
            <td class="px-6 py-4">
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  :checked="member.isActive"
                  class="sr-only peer"
                  @change="toggleStaffStatus(member.id)"
                >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  {{ member.isActive ? 'Active' : 'Inactive' }}
                </span>
              </label>
            </td>
            <td class="px-6 py-4">
              <button 
                type="button"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                @click="openEditStaffModal(member)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add/Edit Staff Modal -->
    <div v-if="isAddStaffModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ editingStaff ? 'Edit Staff Member' : 'Add New Staff Member' }}
        </h3>
        
        <form @submit.prevent="saveStaff" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input 
              type="text" 
              v-model="newStaff.name"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select 
              v-model="newStaff.role"
              class="form-select"
              required
            >
              <option value="">Select role</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input 
              type="email" 
              v-model="newStaff.email"
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ editingStaff ? 'New Password (leave blank to keep current)' : 'Password' }}
            </label>
            <input 
              type="password" 
              v-model="newStaff.password"
              class="form-input"
              :required="!editingStaff"
              :placeholder="editingStaff ? '••••••••' : ''"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Avatar URL
            </label>
            <input 
              type="url" 
              v-model="newStaff.avatar"
              class="form-input"
              required
            />
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              class="btn btn-outline"
              @click="isAddStaffModalOpen = false"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary"
            >
              {{ editingStaff ? 'Update Staff' : 'Add Staff' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>