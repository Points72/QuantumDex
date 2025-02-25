import { NextResponse } from "next/server"

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY
const CMC_API_URL = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest"

export async function GET() {
  if (!CMC_API_KEY) {
    console.error("CoinMarketCap API key is not set")
    return NextResponse.json({ error: "CoinMarketCap API key is not set" }, { status: 500 })
  }

  try {
    const response = await fetch(`${CMC_API_URL}?symbol=BTC,ETH`, {
      headers: {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
      },
      next: { revalidate: 60 }, // Cache the result for 60 seconds
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Failed to fetch data from CoinMarketCap: ${response.status} ${response.statusText}. Response: ${errorText}`,
      )
      throw new Error(`Failed to fetch data from CoinMarketCap: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.data || !data.data.BTC || !data.data.ETH) {
      console.error("Unexpected data structure from CoinMarketCap:", JSON.stringify(data))
      throw new Error("Unexpected data structure from CoinMarketCap")
    }

    const formattedData = {
      BTC: {
        price: data.data.BTC.quote.USD.price,
        percent_change_24h: data.data.BTC.quote.USD.percent_change_24h,
      },
      ETH: {
        price: data.data.ETH.quote.USD.price,
        percent_change_24h: data.data.ETH.quote.USD.percent_change_24h,
      },
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching market data:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch market data" }, { status: 500 })
  }
}

