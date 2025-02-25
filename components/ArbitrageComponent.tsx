"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getArbitrageOpportunities, executeArbitrage } from "../lib/arbitrage"

export const ArbitrageComponent: React.FC = () => {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true)
      const ops = await getArbitrageOpportunities()
      setOpportunities(ops)
      setLoading(false)
    }

    fetchOpportunities()
    const interval = setInterval(fetchOpportunities, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleExecuteArbitrage = async (opportunity) => {
    try {
      await executeArbitrage(opportunity)
      // Update UI or show success message
    } catch (error) {
      console.error("Failed to execute arbitrage:", error)
      // Show error message
    }
  }

  if (loading) return <div>Loading arbitrage opportunities...</div>

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Arbitrage Opportunities</h2>
      {opportunities.map((op, index) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg mb-2 flex justify-between items-center">
          <div>
            <p>
              {op.fromExchange} → {op.toExchange}
            </p>
            <p>
              {op.symbol}: {op.profitPercentage.toFixed(2)}% profit
            </p>
          </div>
          <button
            onClick={() => handleExecuteArbitrage(op)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Execute
          </button>
        </div>
      ))}
    </div>
  )
}

