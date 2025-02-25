import { NextResponse } from "next/server"

export async function GET() {
  // In a real implementation, you would fetch prices from a cryptocurrency API
  // This is just a mock-up that returns random prices
  const mockPrices = {
    usdc: 1 + Math.random() * 0.01, // USDC price fluctuates slightly around $1
    sol: 20 + Math.random() * 10, // SOL price between $20 and $30
  }

  return NextResponse.json(mockPrices)
}

