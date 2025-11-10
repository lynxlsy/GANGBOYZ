import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { productId, size, quantity } = await request.json()
    
    // Validate input
    if (!productId || !size || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId, size, and quantity are required' }, 
        { status: 400 }
      )
    }
    
    // This is a mock API endpoint for demonstration purposes
    // In a real implementation, this would connect to a database
    
    return NextResponse.json({ 
      success: true, 
      message: `Stock would be updated in a real implementation. Removed ${quantity} units of size ${size} from product ${productId}`
    })
  } catch (error) {
    console.error('Error updating stock:', error)
    return NextResponse.json(
      { error: 'Failed to update stock' }, 
      { status: 500 }
    )
  }
}