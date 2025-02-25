"use client"

import type React from "react"
import { useState } from "react"
import { getBalance } from "../../src/utils/solana-connection"

const SolanaBalanceChecker: React.FC = () => {
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    try {
      setError(null)
      const result = await getBalance(address)
      setBalance(result / 1e9) // Convert lamports to SOL
    } catch (err) {
      setError("Error fetching balance. Please check the address and try again.")
      setBalance(null)
    }
  }

  return (
    <div>
      <h2>Solana Balance Checker</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Solana address"
      />
      <button onClick={handleCheck}>Check Balance</button>
      {balance !== null && <p>Balance: {balance} SOL</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default SolanaBalanceChecker

