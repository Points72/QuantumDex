"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightLeft } from "lucide-react"

interface ArbitrageOpportunity {
  fromExchange: string
  toExchange: string
  token: string
  profitPercentage: number
}

export function ArbitrageModule() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchArbitrageOpportunities = async () => {
      setIsLoading(true)
      try {
        // In a real implementation, this would call your backend API
        const response = await fetch("/api/arbitrage-opportunities")
        const data = await response.json()
        setOpportunities(data)
      } catch (error) {
        console.error("Failed to fetch arbitrage opportunities:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArbitrageOpportunities()
    const interval = setInterval(fetchArbitrageOpportunities, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const executeArbitrage = async (opportunity: ArbitrageOpportunity) => {
    try {
      // In a real implementation, this would call your backend API to execute the trade
      const response = await fetch("/api/execute-arbitrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(opportunity),
      })
      const result = await response.json()
      console.log("Arbitrage executed:", result)
      // You might want to update the UI or show a notification here
    } catch (error) {
      console.error("Failed to execute arbitrage:", error)
      // Show an error message to the user
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Arbitrage Opportunities</CardTitle>
        <CardDescription>Real-time arbitrage opportunities across exchanges</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading arbitrage opportunities...</p>
        ) : opportunities.length === 0 ? (
          <p>No arbitrage opportunities available at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <li key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-semibold">{opportunity.token}</p>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.fromExchange} <ArrowRightLeft className="inline mx-1" /> {opportunity.toExchange}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-bold">{opportunity.profitPercentage.toFixed(2)}% profit</p>
                  <Button onClick={() => executeArbitrage(opportunity)} size="sm">
                    Execute
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

