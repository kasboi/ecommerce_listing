import { Product, ProductFormData, ProductFilters, Review } from './types'

const API_BASE = '/api'

// API Response Types
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Generic API handler
async function apiCall<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  const data: ApiResponse<T> = await response.json()

  if (!data.success) {
    throw new Error(data.error || 'API request failed')
  }

  return data.data as T
}

// Product API functions
export const productApi = {
  // Get all products with optional filters
  getAll: async (filters?: Partial<ProductFilters>): Promise<Product[]> => {
    const searchParams = new URLSearchParams()

    if (filters?.search) searchParams.append('search', filters.search)
    if (filters?.category && filters.category !== 'all') {
      searchParams.append('category', filters.category)
    }
    if (filters?.minPrice !== undefined) {
      searchParams.append('minPrice', filters.minPrice.toString())
    }
    if (filters?.maxPrice !== undefined) {
      searchParams.append('maxPrice', filters.maxPrice.toString())
    }
    if (filters?.sortBy) searchParams.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) searchParams.append('sortOrder', filters.sortOrder)

    const queryString = searchParams.toString()
    const url = `/products${queryString ? `?${queryString}` : ''}`

    return apiCall<Product[]>(url)
  },

  // Get single product by ID
  getById: async (id: string): Promise<Product> => {
    return apiCall<Product>(`/products/${id}`)
  },

  // Create new product
  create: async (productData: ProductFormData): Promise<Product> => {
    return apiCall<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  },

  // Update existing product
  update: async (id: string, productData: Partial<ProductFormData>): Promise<Product> => {
    return apiCall<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    await apiCall<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  },

  // Reset products to initial state
  reset: async (): Promise<Product[]> => {
    return apiCall<Product[]>('/products/reset', {
      method: 'POST',
    })
  },
}

// Review API functions
export const reviewApi = {
  // Get all reviews for a product
  getByProductId: async (productId: string): Promise<Review[]> => {
    return apiCall<Review[]>(`/reviews/${productId}`)
  },

  // Create new review
  create: async (reviewData: Omit<Review, 'id'>): Promise<Review> => {
    return apiCall<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  },
}

// Categories API function
export const categoryApi = {
  getAll: async (): Promise<string[]> => {
    return apiCall<string[]>('/products/categories')
  },
}
