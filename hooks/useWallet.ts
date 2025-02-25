import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export const WalletConnect = () => {
  const { connected } = useWallet()

  return (
    <div className="flex items-center gap-4">
      <WalletMultiButton />
      {connected && <div className="text-green-500">●</div>}
    </div>
  )
}

