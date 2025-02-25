"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Shield, Activity, Plus } from "lucide-react"

export const VirtualCardsSection = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      number: "4000 1234 5678 9010",
      expires: "12/25",
      balance: "$1,500",
      status: "Active",
      energy: 85,
    },
    {
      id: 2,
      number: "4000 9876 5432 1010",
      expires: "08/26",
      balance: "$2,300",
      status: "Quantum Locked",
      energy: 42,
    },
  ])

  const generateNewCard = () => {
    const newCard = {
      id: cards.length + 1,
      number: `4000 ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}`,
      expires: `${Math.floor(Math.random() * 12 + 1)
        .toString()
        .padStart(2, "0")}/${Math.floor(Math.random() * 5 + 24)}`,
      balance: "$0",
      status: "Active",
      energy: Math.floor(Math.random() * 100),
    }
    setCards([...cards, newCard])
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-6 bg-black text-cyan-400">
      <div className="col-span-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 shadow-[0_0_15px_rgba(0,255,255,0.3)] backdrop-blur-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Quantum Cards
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewCard}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 rounded-lg text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.5)] flex items-center"
            >
              <Plus className="mr-2" size={18} />
              Generate Card
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_0_20px_rgba(0,255,255,0.2)] backdrop-blur-md"
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=400&width=300')] opacity-10 mix-blend-overlay" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <span className="text-sm font-medium text-cyan-300">Quantum Card</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          card.status === "Active" ? "bg-green-500" : "bg-purple-500"
                        } text-black font-bold`}
                      >
                        {card.status}
                      </span>
                    </div>
                    <p className="text-2xl mb-8 font-mono text-cyan-100">{card.number}</p>
                    <div className="flex justify-between items-center text-cyan-200">
                      <div>
                        <p className="text-xs text-cyan-400">Expires</p>
                        <p className="font-medium">{card.expires}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400">Balance</p>
                        <p className="font-medium">{card.balance}</p>
                      </div>
                      <div>
                        <p className="text-xs text-cyan-400">Energy</p>
                        <div className="w-16 h-2 bg-slate-700 rounded-full mt-1">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full energy-bar"
                            style={{ "--energy-width": `${card.energy}%` } as React.CSSProperties}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="absolute bottom-2 right-2 text-cyan-300 opacity-50" size={24} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 shadow-[0_0_15px_rgba(0,255,255,0.3)] backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            <Shield className="mr-2 text-cyan-400" size={20} />
            Quantum Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="energy-limit" className="text-sm text-cyan-300">
                Energy Limit
              </label>
              <input
                id="energy-limit"
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-slate-700 rounded-full mt-2 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400"
              />
            </div>
            <div>
              <label htmlFor="quantum-security" className="text-sm text-cyan-300">
                Quantum Security
              </label>
              <select
                id="quantum-security"
                className="w-full bg-slate-700 rounded-lg px-4 py-2 mt-2 text-cyan-100 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Entanglement Encryption</option>
                <option>Quantum Tunneling</option>
                <option>Superposition Lock</option>
              </select>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-2 rounded-lg text-white font-semibold shadow-[0_0_10px_rgba(255,0,255,0.5)] mt-4 flex items-center justify-center">
              <Zap className="mr-2" size={18} />
              Quantum Lock All Cards
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 bg-gradient-to-br from-slate-900 to-slate-800 shadow-[0_0_15px_rgba(0,255,255,0.3)] backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            <Activity className="mr-2 text-cyan-400" size={20} />
            Quantum Actions
          </h2>
          <div className="space-y-2">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded-lg text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.5)] flex items-center justify-center">
              <Sparkles className="mr-2" size={18} />
              Entangle Energy
            </button>
            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-2 rounded-lg text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.5)] flex items-center justify-center">
              <Activity className="mr-2" size={18} />
              View Quantum Ledger
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}