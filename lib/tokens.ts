// lib/tokens.ts
export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  logoUrl?: string;
  id: string; // Add CoinGecko ID
}

export const COMMON_TOKENS: TokenInfo[] = [
  { symbol: "USDT", name: "Tether", address: "...", id: "tether" },
  { symbol: "MATIC", name: "Polygon", address: "...", id: "matic-network" },
  { symbol: "SOL", name: "Solana", address: "...", id: "solana" },
  // Add more tokens with their CoinGecko IDs
];