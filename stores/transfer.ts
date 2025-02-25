import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface Transaction {
  id: string
  method: string
  amount: string
  currency: string
  recipient: string
  status: "pending" | "completed" | "failed"
  timestamp: Date
}

interface TransferFormData {
  amount: string
  currency: string
  method: string
  recipient: string
}

interface TransferState {
  isLoading: boolean
  error: string | null
  transactions: Transaction[]
  initiateTransfer: (data: TransferFormData) => Promise<void>
  fetchTransactions: () => Promise<void>
}

export const useTransferStore = create<TransferState>()(
  devtools(
    (set, get) => ({
      isLoading: false,
      error: null,
      transactions: [],

      initiateTransfer: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch("/api/transfer/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })

          if (!response.ok) throw new Error("Transfer failed")

          const result = await response.json()
          set((state) => ({
            transactions: [result, ...state.transactions],
          }))
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchTransactions: async () => {
        set({ isLoading: true })
        try {
          const response = await fetch("/api/transfer/history")
          if (!response.ok) throw new Error("Failed to fetch transactions")

          const transactions = await response.json()
          set({ transactions })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    { name: "transfer-store" },
  ),
)

