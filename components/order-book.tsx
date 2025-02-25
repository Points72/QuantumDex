interface OrderBookProps {
  pair: string
}

export function OrderBook({ pair }: OrderBookProps) {
  // Здесь бы мы получали реальные данные стакана
  const asks = [
    { price: 30100, amount: 0.5 },
    { price: 30150, amount: 1.2 },
    { price: 30200, amount: 0.8 },
  ]
  const bids = [
    { price: 30050, amount: 0.7 },
    { price: 30000, amount: 1.5 },
    { price: 29950, amount: 0.9 },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Order Book</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-red-500 mb-1">Asks</h4>
          {asks.map((ask) => (
            <div key={ask.price} className="flex justify-between text-sm">
              <span>{ask.price}</span>
              <span>{ask.amount}</span>
            </div>
          ))}
        </div>
        <div>
          <h4 className="text-green-500 mb-1">Bids</h4>
          {bids.map((bid) => (
            <div key={bid.price} className="flex justify-between text-sm">
              <span>{bid.price}</span>
              <span>{bid.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

