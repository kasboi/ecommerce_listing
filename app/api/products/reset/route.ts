import { NextRequest, NextResponse } from 'next/server'
import { productService } from '../../../../src/lib/server-storage'

export async function POST() {
  try {
    const products = productService.reset()

    return NextResponse.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('Error resetting products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset products' },
      { status: 500 }
    )
  }
}
