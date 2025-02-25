"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { ArrowUpDown } from "lucide-react";
import { type TokenInfo, COMMON_TOKENS } from "@/lib/tokens";
import { fetchPrice } from "@/lib/price-fetcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";

const COINMARKETCAP_API_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;

export const SimplifiedQuantumSwap: React.FC = () => {
  const [fromToken, setFromToken] = useState<TokenInfo>(
    COMMON_TOKENS.find((t) => t.symbol === "USDT") || COMMON_TOKENS[0]
  );
  const [toToken, setToToken] = useState<TokenInfo>(
    COMMON_TOKENS.find((t) => t.symbol === "MATIC") || COMMON_TOKENS[1]
  );
  const [amount, setAmount] = useState("1");
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slippage, setSlippage] = useState(0.5);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [autoRouter, setAutoRouter] = useState(true);
  const wallet = useWallet();

  const fetchCoinMarketCapData = useCallback(async (symbol: string) => {
    try {
      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY || "",
          },
        }
      );
      if (!response.ok) throw new Error(`CoinMarketCap API error: ${response.statusText}`);
      const data = await response.json();
      return data.data[symbol].quote.USD.price;
    } catch (error) {
      console.error("Error fetching CoinMarketCap data:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchAllPrices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prices: { [key: string]: number } = {};
        if (!Array.isArray(COMMON_TOKENS)) {
          throw new Error("COMMON_TOKENS is not an array");
        }

        const pricePromises = COMMON_TOKENS.map(async (token) => {
          try {
            const price = await fetchPrice(token.id); // Use token.id instead of token.symbol
            return { [token.symbol]: price };
          } catch (err) {
            console.error(`Error fetching price for ${token.symbol}:`, err);
            return { [token.symbol]: tokenPrices[token.symbol] || 0 };
          }
        });

        const resolvedPrices = await Promise.all(pricePromises);
        resolvedPrices.forEach((priceObj) => Object.assign(prices, priceObj));
        setTokenPrices(prices);
      } catch (err) {
        console.error("Error fetching token prices:", err);
        setError("Error loading currency rates. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const getReceiveAmount = () => {
    if (
      !amount ||
      !tokenPrices[fromToken.symbol] ||
      !tokenPrices[toToken.symbol] ||
      isNaN(Number(amount))
    )
      return "0";
    const fromAmount = new BN(Number.parseFloat(amount) * 1e9);
    const fromPrice = new BN(tokenPrices[fromToken.symbol] * 1e9);
    const toPrice = new BN(tokenPrices[toToken.symbol] * 1e9);
    const receiveAmount = fromAmount.mul(fromPrice).div(toPrice);
    return (receiveAmount.toNumber() / 1e9).toFixed(6);
  };

  const handleQuantumExchange = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Quantum Exchange executed");
    }, 2000);
  };

  const TokenSelector = ({
    token,
    setToken,
    label,
  }: {
    token: TokenInfo;
    setToken: (t: TokenInfo) => void;
    label: string;
  }) => {
    const [search, setSearch] = useState("");
    const filteredTokens = COMMON_TOKENS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-[140px] justify-between bg-[#13132D] border-[#2A2B4E] hover:border-[#4A90E2] text-[#7A88FF] h-[40px]"
          >
            <div className="flex items-center">
              <img
                src={token.logoUrl || "/placeholder.svg"}
                alt={token.symbol}
                className="w-5 h-5 mr-2"
              />
              <span className="text-[#7A88FF]">{token.symbol}</span>
            </div>
            <span className="text-[#4A90E2]">▼</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#0A0B1E]/95 backdrop-blur-xl border-[#4A90E2]/30">
          <DialogHeader>
            <DialogTitle className="text-[#7A88FF]">Select {label}</DialogTitle>
            <DialogDescription className="text-[#4A90E2]">
              Choose the token you want to swap.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens..."
              className="bg-[#13132D] border-[#2A2B4E] text-[#7A88FF] focus:border-[#4A90E2]"
            />
          </div>
          <ScrollArea className="h-[300px] pr-4">
            {filteredTokens.map((t) => (
              <Button
                key={t.address}
                variant="ghost"
                onClick={() => {
                  setToken(t);
                  setSearch("");
                }}
                className="w-full justify-start hover:bg-[#1A1B3E]/70 text-[#7A88FF] mb-2"
              >
                <img
                  src={t.logoUrl || "/placeholder.svg"}
                  alt={t.symbol}
                  className="w-6 h-6 mr-2"
                />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{t.symbol}</span>
                  <span className="text-sm text-[#4A90E2]">{t.name}</span>
                </div>
              </Button>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-[#0B0B1E] rounded-2xl shadow-2xl border border-[#2A2B4E] overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-[#7A88FF]">Quantum Swap</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#4A90E2]">Advanced</span>
            <Switch checked={isAdvancedMode} onCheckedChange={setIsAdvancedMode} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#13132D] rounded-xl p-4 border border-[#2A2B4E]">
            <div className="flex justify-between mb-2">
              <span className="text-[#7A88FF]">You give</span>
              <span className="text-[#4A90E2]">Balance: {fromToken.symbol} 0.00</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-2xl text-[#7A88FF] focus:outline-none"
                placeholder="0.0"
              />
              <TokenSelector token={fromToken} setToken={setFromToken} label="From Token" />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSwap}
              size="icon"
              className="rounded-full bg-[#2A2B4E] hover:bg-[#3A3B5E] w-8 h-8"
            >
              <ArrowUpDown className="w-4 h-4 text-[#4A90E2]" />
            </Button>
          </div>

          <div className="bg-[#13132D] rounded-xl p-4 border border-[#2A2B4E]">
            <div className="flex justify-between mb-2">
              <span className="text-[#7A88FF]">You receive</span>
              <span className="text-[#4A90E2]">Balance: {toToken.symbol} 0.00</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={getReceiveAmount()}
                readOnly
                className="w-full bg-transparent text-2xl text-[#7A88FF] focus:outline-none"
                placeholder="0.0"
              />
              <TokenSelector token={toToken} setToken={setToToken} label="To Token" />
            </div>
          </div>

          {isAdvancedMode && (
            <div className="bg-[#13132D] rounded-xl p-4 border border-[#2A2B4E] space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#7A88FF]">Slippage Tolerance</span>
                  <span className="text-[#4A90E2]">{slippage}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(Number(e.target.value))}
                    className="bg-[#13132D] border-[#2A2B4E] text-[#7A88FF]"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setSlippage(0.5)}
                    className="bg-[#2A2B4E] text-[#7A88FF]"
                  >
                    0.5%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSlippage(1)}
                    className="bg-[#2A2B4E] text-[#7A88FF]"
                  >
                    1.0%
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSlippage(2)}
                    className="bg-[#2A2B4E] text-[#7A88FF]"
                  >
                    2.0%
                  </Button>
                </div>
                <Slider
                  value={[slippage]}
                  onValueChange={(value) => setSlippage(value[0])}
                  max={5}
                  step={0.1}
                  className="my-4"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A88FF]">Auto Router</span>
                <Switch checked={autoRouter} onCheckedChange={setAutoRouter} />
              </div>
            </div>
          )}

          <Button
            onClick={handleQuantumExchange}
            disabled={isLoading}
            className="w-full py-4 bg-[#4A90E2] hover:bg-[#7A88FF] text-white transition-colors"
          >
            {isLoading ? "Processing..." : "Quantum Exchange"}
          </Button>

          {error && <div className="text-center text-sm text-red-500">{error}</div>}
          <div className="text-center text-sm text-[#4A90E2]">Powered by Quantum Technology</div>
        </div>
      </div>
    </div>
  );
};