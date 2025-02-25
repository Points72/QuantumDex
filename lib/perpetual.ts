import { PerpetualProtocol } from "@perp/sdk"
import { ethers } from "ethers"

export async function openPosition(market: string, side: string, leverage: number, amount: string) {
  // Initialize Perpetual Protocol SDK
  const provider = new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io")
  const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider)
  const perp = new PerpetualProtocol({
    chainId: 10, // Optimism
    provider: provider,
    signer: signer,
  })

  await perp.init()

  // Open position
  const openPositionResult = await perp.clearingHouse.openPosition({
    baseToken: market,
    isLong: side === "long",
    amount: ethers.utils.parseUnits(amount, 18),
    leverage: leverage,
  })

  return {
    success: true,
    txHash: openPositionResult.txHash,
  }
}

