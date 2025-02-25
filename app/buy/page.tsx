import { MoonPayWidget } from "@/components/moonpay-widget"

export default function BuyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
        Buy Crypto
      </h1>
      <div className="bg-[#0A0B1E]/70 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#4A90E2]/30 shadow-lg hover:shadow-[#7A88FF]/30 transition-all duration-500">
        <MoonPayWidget />
      </div>
    </div>
  )
}

