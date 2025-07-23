import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi, reviewApi, categoryApi } from '../lib/api'
import { Product, ProductFormData, ProductFilters, Review } from '../lib/types'

// Query Keys
export const queryKeys = {
  products: ['products'] as const,
  productsByFilters: (filters?: Partial<ProductFilters>) => ['products', filters] as const,
  product: (id: string) => ['products', id] as const,
  reviews: (productId: string) => ['reviews', productId] as const,
  categories: ['categories'] as const,
}

// Product Hooks
export function useProducts(filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: queryKeys.productsByFilters(filters),
    queryFn: () => productApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: ProductFormData) => productApi.create(productData),
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      productApi.update(id, data),
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        queryKeys.product(updatedProduct.id),
        updatedProduct
      )
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: queryKeys.product(deletedId) })
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
  })
}

export function useResetProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => productApi.reset(),
    onSuccess: () => {
      // Clear all product-related cache
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      // Clear individual product queries
      queryClient.removeQueries({
        queryKey: ['products'],
        predicate: (query) => query.queryKey.length > 1
      })
    },
  })
}

// Review Hooks
export function useReviews(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews(productId),
    queryFn: () => reviewApi.getByProductId(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (reviewData: Omit<Review, 'id'>) => reviewApi.create(reviewData),
    onSuccess: (newReview) => {
      // Add the review to the cache
      queryClient.setQueryData<Review[]>(
        queryKeys.reviews(newReview.productId),
        (oldReviews = []) => [newReview, ...oldReviews]
      )
      // Invalidate the product to update rating/reviewCount
      queryClient.invalidateQueries({
        queryKey: queryKeys.product(newReview.productId)
      })
      // Invalidate products list to update rating in listings
      queryClient.invalidateQueries({ queryKey: queryKeys.products })
    },
  })
}

// Category Hooks
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoryApi.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes - categories don't change often
  })
}

// Optimistic Updates Helper
export function useOptimisticProduct() {
  const queryClient = useQueryClient()

  const updateOptimistically = (id: string, updates: Partial<Product>) => {
    queryClient.setQueryData(queryKeys.product(id), (old: Product | undefined) =>
      old ? { ...old, ...updates } : undefined
    )
  }

  return { updateOptimistically }
}
