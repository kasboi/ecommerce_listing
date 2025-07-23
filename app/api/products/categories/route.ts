import { NextResponse } from 'next/server'
import { productService } from '../../../../src/lib/server-storage'

export async function GET() {
  try {
    const categories = productService.getCategories()

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
