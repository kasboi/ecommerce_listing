import { NextRequest, NextResponse } from 'next/server'
import { reviewService } from '../../../src/lib/server-storage'

export async function GET() {
  try {
    const reviews = reviewService.getAll()

    return NextResponse.json({
      success: true,
      data: reviews
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.author || !body.rating || !body.comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newReview = reviewService.create(body)

    return NextResponse.json({
      success: true,
      data: newReview
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
