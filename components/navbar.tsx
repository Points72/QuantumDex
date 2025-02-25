"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart2,
  Droplet,
  RefreshCw,
  BracketsIcon as Bridge,
  Send,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { WalletConnectProvider } from "./wallet-connect"; // Updated import
import { motion } from "framer-motion";

// Navigation items
const navItems = [
  { id: "swap", icon: ArrowLeftRight, label: "Swap", href: "/" },
  { id: "trade", icon: BarChart2, label: "Trade", href: "/trade" },
  { id: "pool", icon: Droplet, label: "Pool", href: "/pool" },
  { id: "arbitrage", icon: RefreshCw, label: "Arbitrage", href: "/arbitrage" },
  { id: "bridge", icon: Bridge, label: "Bridge", href: "/bridge" },
  { id: "transfer", icon: Send, label: "Transfer", href: "/transfer" },
  { id: "cards", icon: CreditCard, label: "Cards", href: "/cards" },
  { id: "buy", icon: DollarSign, label: "Buy", href: "/buy" },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-gradient-to-r from-[#0A0B1E] via-[#1A1B3E] to-[#0A0B1E] border-b border-[#4A90E2]/50 shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center group">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full transform transition-transform duration-300 hover:scale-105"
              >
                <defs>
                  <radialGradient id="backgroundGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" className="stop-background-start" />
                    <stop offset="100%" className="stop-background-end" />
                  </radialGradient>
                  <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" className="stop-center-start" />
                    <stop offset="100%" className="stop-center-end" />
                  </radialGradient>
                  <filter id="orbitsGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="particleGlow">
                    <feGaussianBlur stdDeviation="1" />
                    <feComposite in="SourceGraphic" />
                  </filter>
                </defs>
                <circle cx="150" cy="150" r="145" fill="url(#backgroundGlow)" />
                <circle cx="150" cy="150" r="142" stroke="#4A90E2" strokeWidth="0.5" fill="none" opacity="0.2" />
                <g transform="translate(150,150)">
                  <circle r="30" fill="url(#centerGlow)" opacity="0.5" />
                  <g fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                    <circle r="22" />
                    <path d="M0,-22 L19,11 L-19,11 Z" />
                    <path d="M-15,-15 L15,15 M-15,15 L15,-15" />
                  </g>
                </g>
                <g transform="translate(150,150)" filter="url(#orbitsGlow)">
                  <g stroke="#4A90E2" fill="none" opacity="0.8" strokeWidth="1">
                    <ellipse rx="75" ry="75" />
                    <ellipse rx="75" ry="75" transform="rotate(60)" />
                    <ellipse rx="75" ry="75" transform="rotate(120)" />
                  </g>
                  <g filter="url(#particleGlow)">
                    <g fill="#FFFFFF">
                      <circle cx="75" cy="0" r="2.5" />
                      <circle cx="-75" cy="0" r="2.5" />
                      <circle cx="37.5" cy="64.95" r="2.5" />
                      <circle cx="-37.5" cy="-64.95" r="2.5" />
                      <circle cx="-37.5" cy="64.95" r="2.5" />
                      <circle cx="37.5" cy="-64.95" r="2.5" />
                    </g>
                    <g fill="#FFFFFF" opacity="0.6">
                      <circle cx="0" cy="75" r="1" />
                      <circle cx="0" cy="-75" r="1" />
                      <circle cx="65" cy="37.5" r="1" />
                      <circle cx="-65" cy="-37.5" r="1" />
                      <circle cx="-65" cy="37.5" r="1" />
                      <circle cx="65" cy="-37.5" r="1" />
                    </g>
                  </g>
                </g>
                <g opacity="0.15">
                  <text fontFamily="monospace" fill="#4A90E2" fontSize="6">
                    <tspan x="20" y="30">01 10</tspan>
                    <tspan x="270" y="270">10 01</tspan>
                  </text>
                </g>
                <g fill="#FFFFFF">
                  <circle cx="75" cy="75" r="0.5" opacity="0.3" />
                  <circle cx="225" cy="75" r="0.5" opacity="0.3" />
                  <circle cx="75" cy="225" r="0.5" opacity="0.3" />
                  <circle cx="225" cy="225" r="0.5" opacity="0.3" />
                  <circle cx="150" cy="40" r="0.5" opacity="0.3" />
                  <circle cx="150" cy="260" r="0.5" opacity="0.3" />
                </g>
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white drop-shadow-lg hidden sm:inline-block">
              QuantumDEX
            </span>
          </div>

          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto sm:overflow-x-visible">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`group px-2 py-2 sm:px-3 sm:py-2 rounded-md transition-all duration-300 relative ${
                    isActive ? "bg-[#4A90E2]/30 text-white" : "text-gray-300 hover:bg-[#4A90E2]/20 hover:text-white"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? "text-white scale-110" : "text-gray-300 group-hover:scale-110"
                      }`}
                    />
                    <span className="text-xs mt-1 hidden sm:inline-block">{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-[#7A88FF]/20 rounded-md z-0"
                      layoutId="activeNavItem"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden sm:block">
            <WalletConnectProvider>
              <button
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                aria-label="Connect Wallet"
              >
                Connect Wallet
              </button>
            </WalletConnectProvider>
          </div>
        </div>
      </div>
    </div>
  );
};