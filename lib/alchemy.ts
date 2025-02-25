import { Alchemy, Network } from "alchemy-sdk"

const settings = {
  apiKey: process.env.ALCHEMY_API_URL,
  network: Network.ETH_MAINNET,
}

export const alchemy = new Alchemy(settings)

