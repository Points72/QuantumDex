// Augment the Window interface to include ethereum for TypeScript
declare global {
  interface Window {
    ethereum?: import("ethers").ExternalProvider;
  }
}

import { ethers } from "ethers";

const CHAIN_IDS: { [key: string]: number } = {
  Ethereum: 1,
  BSC: 56,
  Polygon: 137,
  Avalanche: 43114,
  Arbitrum: 42161,
};

const BRIDGE_ABI = [
  "function bridge(uint16 _dstChainId, address _toAddress, uint256 _amount, bool _useZro, bytes _adapterParams) external payable",
  "function estimateFees(uint16 _dstChainId, address _toAddress, uint256 _amount, bool _useZro, bytes _adapterParams) external view returns (uint256 nativeFee, uint256 zroFee)",
];

export interface BridgeTransaction {
  fromChain: string;
  toChain: string;
  token: string;
  amount: string;
  status: "pending" | "completed" | "failed";
  txHash: string;
  timestamp: number;
}

class BridgeService {
  private bridgeAddress: string;
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null = null; // Updated to handle both provider types

  constructor(bridgeAddress: string) {
    this.bridgeAddress = bridgeAddress;
  }

  private async initializeProvider(): Promise<ethers.JsonRpcProvider | ethers.BrowserProvider> {
    if (this.provider) return this.provider;

    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      const infuraUrl = process.env.NEXT_PUBLIC_INFURA_URL;
      if (!infuraUrl) {
        throw new Error("Infura URL is not configured");
      }
      this.provider = new ethers.JsonRpcProvider(infuraUrl);
    }
    return this.provider;
  }

  async connectWallet(): Promise<ethers.JsonRpcSigner> {
    const provider = await this.initializeProvider();

    if (provider instanceof ethers.BrowserProvider) {
      await provider.send("eth_requestAccounts", []);
      return await provider.getSigner();
    }
    throw new Error("MetaMask is not available. Please install MetaMask to use this feature.");
  }

  async estimateFees(fromChain: string, toChain: string, amount: string): Promise<string> {
    const provider = await this.initializeProvider();
    const signer = provider instanceof ethers.BrowserProvider ? await provider.getSigner() : null;

    if (!signer) {
      throw new Error("Signer required for fee estimation. Use MetaMask or configure a provider.");
    }

    const bridgeContract = new ethers.Contract(this.bridgeAddress, BRIDGE_ABI, signer);

    const dstChainId = CHAIN_IDS[toChain];
    const amountWei = ethers.parseEther(amount);

    try {
      const [nativeFee] = await bridgeContract.estimateFees(
        dstChainId,
        await signer.getAddress(),
        amountWei,
        false,
        "0x",
      );
      return ethers.formatEther(nativeFee);
    } catch (error) {
      console.error("Error estimating fees:", error);
      throw new Error("Failed to estimate bridge fees");
    }
  }

  async executeBridge(fromChain: string, toChain: string, token: string, amount: string): Promise<BridgeTransaction> {
    const provider = await this.initializeProvider();
    const signer = provider instanceof ethers.BrowserProvider ? await provider.getSigner() : null;

    if (!signer) {
      throw new Error("Signer required for bridge transaction. Use MetaMask or configure a provider.");
    }

    const bridgeContract = new ethers.Contract(this.bridgeAddress, BRIDGE_ABI, signer);

    const dstChainId = CHAIN_IDS[toChain];
    const amountWei = ethers.parseEther(amount);

    try {
      const tx = await bridgeContract.bridge(dstChainId, await signer.getAddress(), amountWei, false, "0x", {
        value: amountWei,
      });

      const receipt = await tx.wait();

      return {
        fromChain,
        toChain,
        token,
        amount,
        status: "pending",
        txHash: receipt.transactionHash,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error("Error executing bridge transaction:", error);
      throw new Error("Failed to execute bridge transaction");
    }
  }

  async getBridgeStatus(txHash: string): Promise<"pending" | "completed" | "failed"> {
    const provider = await this.initializeProvider();
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      if (!receipt) return "pending";
      return receipt.status === 1 ? "completed" : "failed";
    } catch (error) {
      console.error("Error checking bridge status:", error);
      return "failed";
    }
  }
}

// Initialize with a default bridge address - this should be updated with the actual deployed bridge contract address
export const bridgeService = new BridgeService("0x123456789..."); // Replace with actual bridge contract address