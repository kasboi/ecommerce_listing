import { NextRequest, NextResponse } from 'next/server'
import { productService } from '../../../src/lib/server-storage'
import { ProductFormData } from '../../../src/lib/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sortBy: (searchParams.get('sortBy') as 'name' | 'price' | 'rating') || undefined,
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || undefined,
    }

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    )

    const products = productService.getAll(cleanFilters)

    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProductFormData = await request.json()

    // Basic validation
    if (!body.name || !body.description || !body.price || !body.category || !body.image) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    const newProduct = productService.create(body)

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
