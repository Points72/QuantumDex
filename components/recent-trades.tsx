interface RecentTradesProps {
  pair: string
}

export function RecentTrades({ pair }: RecentTradesProps) {
  // Здесь бы мы получали реальные данные о последних сде��ках
  const trades = [
    { id: 1, price: 30100, amount: 0.1, time: "14:30:25" },
    { id: 2, price: 30050, amount: 0.5, time: "14:30:20" },
    { id: 3, price: 30150, amount: 0.3, time: "14:30:15" },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Recent Trades</h3>
      <div className="space-y-2">
        {trades.map((trade) => (
          <div key={trade.id} className="flex justify-between text-sm">
            <span className={trade.price >= 30100 ? "text-green-500" : "text-red-500"}>{trade.price}</span>
            <span>{trade.amount}</span>
            <span className="text-gray-400">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

