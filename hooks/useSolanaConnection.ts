"use client"

import { useState, useEffect } from "react"
import { Connection, clusterApiUrl } from "@solana/web3.js"

export const useSolanaConnection = () => {
  const [connection, setConnection] = useState<Connection | null>(null)

  useEffect(() => {
    const conn = new Connection(clusterApiUrl("mainnet-beta"))
    setConnection(conn)
  }, [])

  return connection
}

