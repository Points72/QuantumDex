"use client";

import { Navbar } from "@/components/navbar";
import { WalletConnectProvider } from "@/components/wallet-connect";
import { useEffect, useRef } from "react";

export default function ClientNavbar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Example logic: Log when the component mounts
    console.log("ClientNavbar mounted");
    if (ref.current) {
      console.log("Ref is attached to:", ref.current);
    }
  }, []);

  return (
    <div ref={ref}>
      <Navbar />
      <WalletConnectProvider>
        {/* Example child content */}
        <span>Wallet connection provider content</span>
      </WalletConnectProvider>
    </div>
  );
}