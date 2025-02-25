"use client"

import { TradeSection } from "@/components/trade-section"
import dynamic from "next/dynamic"

const TradingViewWidget = dynamic(() => import("@/components/TradingViewWidget"), {
  ssr: false,
})

export default function TradePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
        Trade
      </h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#4A90E2]/30 shadow-lg hover:shadow-[#7A88FF]/30 transition-all duration-500">
          <div className="h-[400px] sm:h-[600px]">
            <TradingViewWidget />
          </div>
        </div>
        <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#4A90E2]/30 shadow-lg hover:shadow-[#7A88FF]/30 transition-all duration-500">
          <TradeSection />
        </div>
      </div>
    </div>
  )
}

