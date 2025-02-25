"use client"

import type React from "react"

import { useState } from "react"

interface TradeFormProps {
  pair: string
}

export function TradeForm({ pair }: TradeFormProps) {
  const [orderType, setOrderType] = useState("market")
  const [side, setSide] = useState("buy")
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь бы мы отправляли ордер на сервер
    console.log("Order submitted:", { pair, orderType, side, amount, price })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Place Order</h3>
      <div className="flex space-x-2">
        <button
          type="button"
          className={`flex-1 py-2 rounded ${side === "buy" ? "bg-green-600" : "bg-slate-700"}`}
          onClick={() => setSide("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded ${side === "sell" ? "bg-red-600" : "bg-slate-700"}`}
          onClick={() => setSide("sell")}
        >
          Sell
        </button>
      </div>
      <select
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
        className="w-full bg-slate-700 p-2 rounded"
      >
        <option value="market">Market</option>
        <option value="limit">Limit</option>
      </select>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full bg-slate-700 p-2 rounded"
      />
      {orderType === "limit" && (
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-slate-700 p-2 rounded"
        />
      )}
      <button type="submit" className="w-full bg-blue-600 py-2 rounded">
        Place Order
      </button>
    </form>
  )
}

