import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()

    // Here would be the actual logic for initiating a transfer
    // For now, we'll just simulate a successful transfer

    const transaction = {
      id: Date.now().toString(),
      ...data,
      status: "pending",
      timestamp: new Date(),
    }

    return NextResponse.json(transaction)
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate transfer" }, { status: 500 })
  }
}

