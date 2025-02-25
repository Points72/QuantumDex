"use client"

import { useState, useEffect } from "react"
import { bridgeService, type BridgeTransaction } from "../bridge-service"

export function useBridge() {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load transactions from local storage
    const storedTransactions = localStorage.getItem("bridgeTransactions")
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    }
  }, [])

  useEffect(() => {
    // Save transactions to local storage
    localStorage.setItem("bridgeTransactions", JSON.stringify(transactions))
  }, [transactions])

  const estimateFees = async (fromChain: string, toChain: string, amount: string) => {
    try {
      setIsLoading(true)
      const fees = await bridgeService.estimateFees(fromChain, toChain, amount)
      setIsLoading(false)
      return fees
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to estimate fees")
      setIsLoading(false)
      throw err
    }
  }

  const executeBridge = async (fromChain: string, toChain: string, token: string, amount: string) => {
    try {
      setIsLoading(true)
      const transaction = await bridgeService.executeBridge(fromChain, toChain, token, amount)
      setTransactions((prev) => [transaction, ...prev])
      setIsLoading(false)
      return transaction
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute bridge transaction")
      setIsLoading(false)
      throw err
    }
  }

  const updateTransactionStatuses = async () => {
    const updatedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        if (tx.status === "pending") {
          const status = await bridgeService.getBridgeStatus(tx.txHash)
          return { ...tx, status }
        }
        return tx
      }),
    )
    setTransactions(updatedTransactions)
  }

  useEffect(() => {
    const interval = setInterval(updateTransactionStatuses, 60000) // Check status every minute
    return () => clearInterval(interval)
  }, [transactions, updateTransactionStatuses]) // Added updateTransactionStatuses to dependencies

  return { transactions, isLoading, error, estimateFees, executeBridge }
}

