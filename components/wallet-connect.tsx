"use client";

import React, { ReactNode } from "react";
import { type Chain } from "viem";
import { createConfig, WagmiConfig, http } from "wagmi"; // Added http

const chains = [
  {
    id: 42161,
    name: "Arbitrum One",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://arb1.arbitrum.io/rpc"] },
      public: { http: ["https://arb1.arbitrum.io/rpc"] },
    },
    blockExplorers: {
      default: {
        name: "Arbiscan",
        url: "https://arbiscan.io",
        apiUrl: "https://api.arbiscan.io/api",
      },
    },
  },
] as const satisfies readonly [Chain, ...Chain[]];

const config = createConfig({
  chains,
  client: { transports: { [chains[0].id]: http() } }, // Added client with http transport
});

interface WalletConnectProviderProps {
  children: ReactNode;
}

export function WalletConnectProvider({ children }: WalletConnectProviderProps) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}