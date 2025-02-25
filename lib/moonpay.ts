import crypto from "crypto"

const MOONPAY_API_KEY = process.env.MOONPAY_API_KEY
const MOONPAY_SECRET_KEY = process.env.MOONPAY_SECRET_KEY
const MOONPAY_BASE_URL = "https://buy.moonpay.com"

export async function initiateMoonPayTransaction(amount: string, currency: string) {
  const url = new URL(MOONPAY_BASE_URL)
  url.searchParams.append("apiKey", MOONPAY_API_KEY!)
  url.searchParams.append("currencyCode", currency)
  url.searchParams.append("baseCurrencyAmount", amount)

  // Add signature
  const signature = crypto.createHmac("sha256", MOONPAY_SECRET_KEY!).update(url.search).digest("base64")

  url.searchParams.append("signature", signature)

  return url.toString()
}

