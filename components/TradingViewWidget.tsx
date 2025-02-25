"use client"

import { useEffect, useRef, memo } from "react"

function TradingViewWidget() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (container.current) {
      const script = document.createElement("script")
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      script.type = "text/javascript"
      script.async = true
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:BTCUSDT",
          "interval": "15",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`
      container.current.appendChild(script)
    }
  }, [])

  return (
    <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noreferrer noopener nofollow" target="_blank">
          <span className="text-xs text-[#4A90E2] hover:text-[#7A88FF] transition-colors duration-300">
            Track all markets on TradingView
          </span>
        </a>
      </div>
    </div>
  )
}

export default memo(TradingViewWidget)

