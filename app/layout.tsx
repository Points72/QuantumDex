import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import type { ReactNode } from "react";
import { WalletConnectProvider } from "@/components/wallet-connect"; // Matches the named export
import { PriceUpdates } from "@/components/price-updates";
import QuantumBackground from "@/components/QuantumBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuantumDEX",
  description: "Next-gen decentralized exchange",
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0A0B1E] text-white font-mono`}>
        {projectId ? (
          <WalletConnectProvider>
            <div className="relative min-h-screen overflow-hidden">
              <QuantumBackground />
              <div className="relative z-10 min-h-screen">
                <Navbar />
                <main className="relative">
                  <div className="absolute inset-0 bg-[url('/quantum-particles.svg')] opacity-10 animate-pulse-slow"></div>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -inset-[10%] bg-gradient-radial from-[#7A88FF]/20 to-transparent opacity-50 blur-3xl animate-spin-slow"></div>
                    <div className="absolute -inset-[5%] bg-gradient-conic from-[#4A90E2]/30 via-[#7A88FF]/20 to-[#4A90E2]/30 opacity-30 animate-spin-reverse-slower"></div>
                  </div>
                  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
                    <div className="flex-grow">{children}</div>
                    <PriceUpdates />
                  </div>
                </main>
                <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#4A90E2]/10 to-transparent pointer-events-none"></div>
                <div className="fixed top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#7A88FF]/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </WalletConnectProvider>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>WalletConnect Project ID is not set. Please check your environment variables.</p>
          </div>
        )}
      </body>
    </html>
  );
}