import { BridgeSection } from "@/components/bridge-section"

export default function BridgePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7A88FF] to-[#4A90E2]">
        Bridge
      </h1>
      <BridgeSection />
    </div>
  )
}

