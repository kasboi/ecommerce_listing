// Product interface and related types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  inStock: boolean
  rating: number
  reviewCount: number
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  id: string
  productId: string
  author: string
  rating: number
  comment: string
  date: string
}

export interface ProductFilters {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  sortBy: 'name' | 'price' | 'rating'
  sortOrder: 'asc' | 'desc'
}

export type ProductFormData = Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>
