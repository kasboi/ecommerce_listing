import { NextRequest, NextResponse } from 'next/server'
import { reviewService } from '../../../../src/lib/server-storage'

interface RouteParams {
  params: Promise<{
    productId: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { productId } = await params
    const reviews = reviewService.getByProductId(productId)

    return NextResponse.json({
      success: true,
      data: reviews
    })
  } catch (error) {
    console.error('Error fetching reviews for product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}
