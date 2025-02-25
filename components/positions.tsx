export function Positions() {
  // Здесь бы мы получали реальные данные о позициях пользователя
  const positions = [
    { id: 1, pair: "BTC-USDT", size: 0.1, entryPrice: 30000, markPrice: 30100, pnl: 10 },
    { id: 2, pair: "ETH-USDT", size: 1, entryPrice: 2000, markPrice: 2050, pnl: 50 },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Your Positions</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Pair</th>
              <th className="pb-2">Size</th>
              <th className="pb-2">Entry Price</th>
              <th className="pb-2">Mark Price</th>
              <th className="pb-2">PNL</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.id}>
                <td className="py-2">{position.pair}</td>
                <td>{position.size}</td>
                <td>{position.entryPrice}</td>
                <td>{position.markPrice}</td>
                <td className={position.pnl >= 0 ? "text-green-500" : "text-red-500"}>${position.pnl}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

