import { NextResponse } from "next/server"

// MoonPay URL configuration
const MOONPAY_URL = "https://buy.moonpay.com"
const MOONPAY_API_KEY = process.env.NEXT_PUBLIC_MOONPAY_API || ""

export async function POST(request: Request) {
  if (!MOONPAY_API_KEY) {
    return NextResponse.json({ error: "MoonPay API key is not configured" }, { status: 500 })
  }

  try {
    const { cryptoCurrency, fiatCurrency, amount } = await request.json()

    // Construct the MoonPay URL with required parameters
    const url = new URL(MOONPAY_URL)
    const params = new URLSearchParams({
      apiKey: MOONPAY_API_KEY,
      currencyCode: cryptoCurrency.toLowerCase(),
      baseCurrencyCode: fiatCurrency.toLowerCase(),
      baseCurrencyAmount: amount.toString(),
      showWalletAddressForm: "true",
    })

    // Return the complete URL for client-side redirect
    return NextResponse.json({
      redirectUrl: `${url.toString()}?${params.toString()}`,
    })
  } catch (error) {
    console.error("Error creating MoonPay transaction:", error)
    return NextResponse.json({ error: "Failed to create MoonPay transaction" }, { status: 500 })
  }
}

