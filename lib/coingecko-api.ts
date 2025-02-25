const API_BASE_URL = "https://api.coingecko.com/api/v3";

// Маппинг символов токенов на их ID в CoinGecko
const TOKEN_ID_MAP: Record<string, string> = {
  WBTC: "wrapped-bitcoin",
  DAI: "dai",
  ETH: "ethereum",
  SOL: "solana",
  USDC: "usd-coin",
  USDT: "tether",
  MATIC: "polygon",
  BNB: "binancecoin",
};

export async function getTokenPrice(tokenSymbol: string): Promise<number | null> {
  try {
    const tokenId = TOKEN_ID_MAP[tokenSymbol.toUpperCase()] || tokenSymbol.toLowerCase();
    if (!tokenId) {
      console.warn(`Неизвестный символ токена: ${tokenSymbol}`);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/simple/price?ids=${tokenId}&vs_currencies=usd`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price data for ${tokenId}: ${response.statusText}`);
    }

    const data = await response.json();
    const price = data[tokenId]?.usd;
    if (price === undefined || price === 0) {
      console.warn(`Цена для ${tokenSymbol} (${tokenId}) недоступна или равна 0`);
      return null;
    }
    return price;
  } catch (error) {
    console.error(`Ошибка получения цены для ${tokenSymbol} (${TOKEN_ID_MAP[tokenSymbol.toUpperCase()] || tokenSymbol}):`, error);
    return null;
  }
}

export async function getTokenPrices(tokenSymbols: string[]): Promise<Record<string, number | null>> {
  try {
    const tokenIds = tokenSymbols.map(symbol => TOKEN_ID_MAP[symbol.toUpperCase()] || symbol.toLowerCase());
    const idsParam = tokenIds.join(",");

    const response = await fetch(`${API_BASE_URL}/simple/price?ids=${idsParam}&vs_currencies=usd`);
    if (!response.ok) {
      throw new Error(`Failed to fetch price data: ${response.statusText}`);
    }

    const data = await response.json();
    const prices: Record<string, number | null> = {};
    tokenSymbols.forEach((symbol, index) => {
      const tokenId = tokenIds[index];
      const price = data[tokenId]?.usd;
      prices[symbol] = price === undefined || price === 0 ? null : price;
    });
    return prices;
  } catch (error) {
    console.error("Error fetching token prices:", error);
    return tokenSymbols.reduce((acc, symbol) => ({ ...acc, [symbol]: null }), {});
  }
}