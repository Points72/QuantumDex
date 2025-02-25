"use client"

import { useState, useEffect, useCallback } from "react"
import type { PublicKey } from "@solana/web3.js"

export const useWalletConnection = () => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connected, setConnected] = useState(false)

  const connectWallet = useCallback(async () => {
    if (typeof window !== "undefined" && window.solana) {
      try {
        await window.solana.connect()
        const key = window.solana.publicKey
        setPublicKey(key)
        setConnected(true)
      } catch (err) {
        console.error("Failed to connect wallet:", err)
      }
    } else {
      console.error("Solana object not found! Get a Phantom Wallet 👻")
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    if (window.solana) {
      window.solana.disconnect()
      setPublicKey(null)
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    if (window.solana) {
      window.solana.on("connect", () => {
        setPublicKey(window.solana.publicKey)
        setConnected(true)
      })
      window.solana.on("disconnect", () => {
        setPublicKey(null)
        setConnected(false)
      })
    }

    return () => {
      if (window.solana) {
        window.solana.removeAllListeners("connect")
        window.solana.removeAllListeners("disconnect")
      }
    }
  }, [])

  return { publicKey, connected, connectWallet, disconnectWallet }
}

