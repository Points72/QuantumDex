"use client"

import type React from "react"
import { useState } from "react"
import { openPosition } from "../lib/perpetual"

export const TradingSection: React.FC = () => {
  const [market, setMarket] = useState("")
  const [side, setSide] = useState("long")
  const [leverage, setLeverage] = useState("1")
  const [amount, setAmount] = useState("")

  const handleTrade = async () => {
    try {
      await openPosition(market, side, Number.parseFloat(leverage), amount)
      // Update UI or show success message
    } catch (error) {
      console.error("Trade failed:", error)
      // Show error message
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Perpetual Trading</h2>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="market">
          Market
        </label>
        <input
          id="market"
          type="text"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Side</label>
        <div>
          <button
            onClick={() => setSide("long")}
            className={`mr-2 ${side === "long" ? "bg-green-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded`}
          >
            Long
          </button>
          <button
            onClick={() => setSide("short")}
            className={`${side === "short" ? "bg-red-500" : "bg-gray-500"} text-white font-bold py-2 px-4 rounded`}
          >
            Short
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="leverage">
          Leverage
        </label>
        <input
          id="leverage"
          type="number"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        onClick={handleTrade}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Open Position
      </button>
    </div>
  )
}

