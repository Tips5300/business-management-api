const API_BASE_URL = 'http://localhost:4000/api'

// Simple token storage
let authToken: string | null = localStorage.getItem('authToken')

export const setAuthToken = (token: string) => {
  authToken = token
  localStorage.setItem('authToken', token)
}

export const removeAuthToken = () => {
  authToken = null
  localStorage.removeItem('authToken')
}

export const getAuthToken = () => authToken

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (response.token) {
      setAuthToken(response.token)
    }
    return response
  },

  register: async (userData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  logout: () => {
    removeAuthToken()
  },
}

// Generic CRUD API
export const createCRUDAPI = (entityName: string) => ({
  getAll: (params?: Record<string, any>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return apiRequest(`/${entityName}${queryString}`)
  },

  getById: (id: string) => apiRequest(`/${entityName}/${id}`),

  create: (data: any) => apiRequest(`/${entityName}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: string, data: any) => apiRequest(`/${entityName}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (id: string) => apiRequest(`/${entityName}/${id}/soft-delete`, {
    method: 'PATCH',
  }),

  restore: (id: string) => apiRequest(`/${entityName}/${id}/restore`, {
    method: 'PATCH',
  }),

  hardDelete: (id: string) => apiRequest(`/${entityName}/${id}`, {
    method: 'DELETE',
  }),

  export: (format: 'json' | 'csv' | 'xlsx', params?: Record<string, any>) => {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : ''
    return fetch(`${API_BASE_URL}/${entityName}/export/${format}${queryString}`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    })
  },

  import: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${API_BASE_URL}/${entityName}/import`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    }).then(res => res.json())
  },
})

// Specific entity APIs
export const customerAPI = createCRUDAPI('customer')
export const productAPI = createCRUDAPI('product')
export const saleAPI = createCRUDAPI('sale')
export const purchaseAPI = createCRUDAPI('purchase')
export const inventoryAPI = createCRUDAPI('stock')
export const userAPI = createCRUDAPI('user')
export const roleAPI = createCRUDAPI('role')
export const permissionAPI = createCRUDAPI('permission')

// Dashboard API
export const dashboardAPI = {
  getStats: () => apiRequest('/dashboard/stats'),
  getSalesData: (period: string) => apiRequest(`/dashboard/sales?period=${period}`),
  getInventoryStatus: () => apiRequest('/dashboard/inventory'),
}