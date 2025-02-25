"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Bot, Activity, Eye } from "lucide-react";
import { ArbitrageSection } from "@/components/arbitrage-section"; // Adjust path as needed

const QuantumHub: React.FC = () => {
  const [volumeData, setVolumeData] = useState<Array<{ time: string; volume: number; spread: string }>>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    Array<{
      id: string;
      type: "Buy" | "Sell";
      pair: string;
      amount: string;
      price: number;
      timestamp: string;
    }>
  >([]);

  // Generate data for the chart
  useEffect(() => {
    const generateVolumeData = () => {
      return Array.from({ length: 20 }, (_, i) => ({
        time: `${i * 3}m`,
        volume: Math.floor(Math.random() * 60000 + 15000),
        spread: (Math.random() * 1.5 + 0.5).toFixed(2),
      }));
    };

    const interval = setInterval(() => {
      setVolumeData(generateVolumeData());
    }, 3000);

    setVolumeData(generateVolumeData());
    return () => clearInterval(interval);
  }, []);

  // Generate transactions
  useEffect(() => {
    const generateTransaction = () => ({
      id: Math.random().toString(36).substr(2, 9),
      type: Math.random() > 0.5 ? "Buy" : "Sell",
      pair: ["BTC/USDT", "ETH/USDT", "SOL/USDT"][Math.floor(Math.random() * 3)],
      amount: (Math.random() * 2).toFixed(4),
      price: Math.floor(Math.random() * 10000 + 30000),
      timestamp: new Date().toISOString(),
    });

    const interval = setInterval(() => {
      setRecentTransactions((prev) => [generateTransaction(), ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Bot className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg text-blue-400">Quantum Trading Hub</h1>
            <p className="text-sm text-slate-400">Real-time arbitrage opportunities</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-black/20 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
            System Active
          </Badge>
          <Badge className="bg-black/20 py-1.5">24h Volume: $12.5M</Badge>
        </div>
      </div>

      {/* Exchange Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          { name: "Binance", pairs: 385, newPairs: 3, activity: 92, spread: 1.45 },
          { name: "KuCoin", pairs: 245, newPairs: 2, activity: 78, spread: 1.12 },
          { name: "OKX", pairs: 195, newPairs: 1, activity: 85, spread: 0.95 },
        ].map((exchange) => (
          <Card key={exchange.name} className="bg-black/20 border-slate-800">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{exchange.name}</h3>
                  <p className="text-sm text-slate-400">{exchange.pairs} pairs tracked</p>
                </div>
                {exchange.newPairs > 0 && (
                  <Badge className="bg-purple-500/10 text-xs">✨ {exchange.newPairs} new pairs</Badge>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Activity Level</span>
                  <span className="text-blue-400">{exchange.activity}%</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${exchange.activity}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spread Distribution</span>
                  <span className="text-emerald-400">{exchange.spread}% top</span>
                </div>
                <div className="flex gap-0.5 h-6">
                  {[35, 30, 20, 15].map((width, i) => (
                    <div
                      key={i}
                      style={{ width: `${width}%` }}
                      className={`
                        ${i === 0 ? "bg-emerald-400/20" : ""}
                        ${i === 1 ? "bg-blue-400/20" : ""}
                        ${i === 2 ? "bg-indigo-400/20" : ""}
                        ${i === 3 ? "bg-purple-400/20" : ""}
                      `}
                    />
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full border-slate-800 hover:bg-slate-800/50">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart and Active Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-black/20 border-slate-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <h2>Volume & Spread History</h2>
              </div>
              <Badge className="bg-black/40">Live</Badge>
            </div>

            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <XAxis dataKey="time" stroke="#444" fontSize={12} />
                  <YAxis stroke="#444" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "4px",
                    }}
                  />
                  <Line type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="spread" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 border-slate-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2>Active Opportunities</h2>
              <Badge className="bg-purple-500/10">Auto-Updated</Badge>
            </div>

            <div className="space-y-2">
              {[
                { pair: "BTC/USDT", price1: "43,250.50", price2: "43,791.25", profit: "+$540.75" },
                { pair: "ETH/USDT", price1: "2,312.75", price2: "2,291.50", profit: "+$21.25" },
              ].map((opp, idx) => (
                <div key={idx} className="p-3 bg-black/40 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-blue-400">{opp.pair}</div>
                        <div className="text-sm text-slate-400">128M 24h Vol</div>
                      </div>
                      <div className="flex gap-4">
                        <div>${opp.price1}</div>
                        <div>${opp.price2}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-800">
                      Execute
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* QBots Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {[
          { name: "BTC/USDT Bot", status: "Active", profit: "+$540.75", winRate: "98.5%", balance: "15,000 USDT" },
          { name: "ETH Scanner", status: "Scanning", profit: "+$320.25", winRate: "97.2%", balance: "12,000 USDT" },
        ].map((bot, idx) => (
          <Card key={idx} className="bg-black/20 border-slate-800">
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{bot.name}</h3>
                  <p className="text-sm text-slate-400">BTC/USDT</p>
                </div>
                <Badge className={bot.status === "Active" ? "bg-emerald-500/10" : "bg-amber-500/10"}>
                  {bot.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-slate-400">24h Profit</div>
                  <div className="text-emerald-400">{bot.profit}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Win Rate</div>
                  <div>{bot.winRate}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Balance</div>
                  <div>{bot.balance}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="border-slate-800">
                  {bot.status === "Active" ? "Stop Bot" : "Start Bot"}
                </Button>
                <Button variant="outline" className="border-slate-800">
                  Configure
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Transactions */}
      <Card className="bg-black/20 border-slate-800">
        <div className="p-4">
          <h2 className="mb-4">Recent Transactions</h2>
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-black/40 rounded-lg animate-fade-in">
                <div className="flex items-center gap-4">
                  <Badge className={tx.type === "Buy" ? "bg-emerald-500/10" : "bg-rose-500/10"}>{tx.type}</Badge>
                  <span>{tx.pair}</span>
                  <span>{tx.amount}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>${tx.price.toLocaleString()}</span>
                  <span className="text-sm text-slate-400">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );

  // Assuming ArbitrageSection is a separate component for arbitrage-specific content
  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">
          Arbitrage
        </h1>
        <ArbitrageSection />
      </div>
    </div>
  );
};

export default QuantumHub;
