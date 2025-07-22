'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Product, ProductFilters } from '../../src/lib/types'
import { getProducts, filterProducts } from '../../src/lib/storage'
import { ProductCard } from '../../src/components/products/product-card'
import { ProductFiltersComponent } from '../../src/components/products/product-filters'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState<Partial<ProductFilters>>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    minPrice: 0,
    maxPrice: undefined,
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allProducts = getProducts()
    setProducts(allProducts)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      const filtered = filterProducts(products, filters)
      setFilteredProducts(filtered)
    }
  }, [products, filters])

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category && filters.category !== 'all') params.set('category', filters.category)
    
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`
    if (newUrl !== window.location.pathname + window.location.search) {
      router.replace(newUrl, { scroll: false })
    }
  }, [filters.search, filters.category, router])

  const handleFiltersChange = (newFilters: Partial<ProductFilters>) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: 0,
      maxPrice: undefined,
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600">
          {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <ProductFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">
            {products.length === 0 
              ? "No products have been added yet."
              : "Try adjusting your filters to find what you're looking for."
            }
          </p>
          {products.length === 0 ? (
            <a
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Products
            </a>
          ) : (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
