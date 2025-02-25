// lib/price-fetcher.ts

// Define the expected response shape from CoinGecko API
interface PriceResponse {
  [key: string]: {
    usd: number;
  };
}

/**
 * Fetches the USD price of a cryptocurrency by its CoinGecko ID.
 * @param id - The CoinGecko ID of the cryptocurrency (e.g., "bitcoin", "ethereum").
 * @returns The USD price or throws an error if the fetch fails.
 */
export async function fetchPrice(id: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch price for ${id}: ${response.statusText}`);
    }

    // Parse the JSON response with type assertion
    const data = (await response.json()) as PriceResponse;

    // Ensure the price exists in the response
    const price = data[id]?.usd;
    if (price === undefined) {
      throw new Error(`Price not found for ${id}`);
    }

    return price;
  } catch (error) {
    console.error(`Error fetching price for ${id}:`, error);
    throw error; // Re-throw to allow caller to handle it
  }
}