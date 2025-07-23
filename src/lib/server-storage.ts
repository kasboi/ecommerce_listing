import { Product, Review, ProductFilters } from './types'

// We'll use a simple in-memory store for demo purposes
// In production, this would be replaced with a database
let productsStore: Product[] = []
let reviewsStore: Review[] = []

// Sample initial data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Sony PlayStation 5 Pro',
    description: 'Next-generation gaming console with 8K support and advanced ray tracing capabilities. Experience gaming like never before with ultra-fast SSD and immersive 3D audio.',
    price: 399.99,
    category: 'Gaming',
    image: '/playstation.jpg',
    inStock: true,
    rating: 4.8,
    reviewCount: 156,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'AirPods Pro (3rd Generation)',
    description: 'Premium wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency mode for the ultimate listening experience.',
    price: 89.99,
    category: 'Audio',
    image: '/airpod.jpg',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'The most advanced iPhone yet with titanium design, A17 Pro chip, and professional camera system with 5x telephoto zoom.',
    price: 599.99,
    category: 'Phones',
    image: '/iphone_15.jpg',
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Polaroid DSLR Camera',
    description: 'Professional full-frame mirrorless camera with 45MP resolution, 8K video recording, and advanced image stabilization.',
    price: 929.99,
    category: 'Photography',
    image: '/product.jpg',
    inStock: true,
    rating: 4.7,
    reviewCount: 67,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Supercharged for pros with M3 Pro chip, up to 18-hour battery life, and stunning Liquid Retina XDR display.',
    price: 1299.99,
    category: 'Laptops',
    image: '/macbook.jpg',
    inStock: false,
    rating: 4.9,
    reviewCount: 124,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Amazon Echo Dot (5th Gen)',
    description: 'Smart speaker with Alexa, improved sound quality, and built-in motion detection for smart home automation.',
    price: 29.99,
    category: 'Smart Home',
    image: '/amazon_echo.jpg',
    inStock: true,
    rating: 4.4,
    reviewCount: 312,
    createdAt: new Date().toISOString(),
  }
]

const initialReviews: Review[] = [
  {
    id: '1',
    productId: '2',
    author: 'John Smith',
    rating: 5,
    comment: 'Excellent sound quality and the noise cancellation is amazing!',
    date: '2024-01-15'
  }
]

// Initialize the store
function initializeStore() {
  if (productsStore.length === 0) {
    productsStore = [...initialProducts]
  }
  if (reviewsStore.length === 0) {
    reviewsStore = [...initialReviews]
  }
}

// Product CRUD operations
export const productService = {
  getAll: (filters?: Partial<ProductFilters>): Product[] => {
    initializeStore()
    let products = [...productsStore]

    if (filters) {
      products = filterProducts(products, filters)
    }

    return products
  },

  getById: (id: string): Product | null => {
    initializeStore()
    return productsStore.find(product => product.id === id) || null
  },

  create: (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt'>): Product => {
    initializeStore()
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    }

    productsStore.push(newProduct)
    return newProduct
  },

  update: (id: string, productData: Partial<Product>): Product | null => {
    initializeStore()
    const index = productsStore.findIndex(product => product.id === id)

    if (index === -1) return null

    productsStore[index] = {
      ...productsStore[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    }

    return productsStore[index]
  },

  delete: (id: string): boolean => {
    initializeStore()
    const initialLength = productsStore.length
    productsStore = productsStore.filter(product => product.id !== id)

    return productsStore.length < initialLength
  },

  // Reset products to initial state
  reset(): Product[] {
    // Reset the in-memory store
    productsStore = [...initialProducts]
    reviewsStore = []
    return [...initialProducts]
  },

  // Get all unique categories
  getCategories(): string[] {
    initializeStore()
    const categories = new Set(productsStore.map(product => product.category))
    return Array.from(categories).sort()
  },
}

// Review CRUD operations
export const reviewService = {
  getAll: (): Review[] => {
    initializeStore()
    return [...reviewsStore]
  },

  getByProductId: (productId: string): Review[] => {
    initializeStore()
    return reviewsStore.filter(review => review.productId === productId)
  },

  create: (reviewData: Omit<Review, 'id'>): Review => {
    initializeStore()
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
    }

    reviewsStore.push(newReview)

    // Update product rating
    updateProductRating(reviewData.productId)

    return newReview
  }
}

// Helper functions
function updateProductRating(productId: string): void {
  const reviews = reviewService.getByProductId(productId)
  if (reviews.length === 0) return

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  productService.update(productId, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length
  })
}

function searchProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) return products

  const lowercaseQuery = query.toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.category.toLowerCase().includes(lowercaseQuery)
  )
}

function filterProducts(products: Product[], filters: Partial<ProductFilters>): Product[] {
  let filtered = [...products]

  if (filters.search) {
    filtered = searchProducts(filtered, filters.search)
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  if (typeof filters.minPrice === 'number') {
    filtered = filtered.filter(product => product.price >= filters.minPrice!)
  }

  if (typeof filters.maxPrice === 'number') {
    filtered = filtered.filter(product => product.price <= filters.maxPrice!)
  }

  // Sort products
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: number | string = a[filters.sortBy!]
      let bValue: number | string = b[filters.sortBy!]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (filters.sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      }
    })
  }

  return filtered
}

export const getCategories = (): string[] => {
  const products = productService.getAll()
  const categories = Array.from(new Set(products.map(product => product.category)))
  return categories.sort()
}
