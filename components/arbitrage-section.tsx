"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Correct import
import { useState, useEffect } from "react";
import { Activity, Eye } from "lucide-react";

export function ArbitrageSection() {
  const [opportunities, setOpportunities] = useState([
    { pair: "BTC/USDT", price1: "43,250.50", price2: "43,791.25", profit: "+$540.75" },
    { pair: "ETH/USDT", price1: "2,312.75", price2: "2,291.50", profit: "+$21.25" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpportunities((prev) =>
        prev.map((opp) => ({
          ...opp,
          profit: `+$${Math.floor(Math.random() * 1000 + 20).toFixed(2)}`,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-black/20 border-slate-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Arbitrage Opportunities</h2>
      <div className="space-y-4">
        {opportunities.map((opp, idx) => (
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
                <Eye className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}