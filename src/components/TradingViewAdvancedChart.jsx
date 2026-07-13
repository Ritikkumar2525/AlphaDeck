'use client';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewAdvancedChart({ symbol }) {
  const container = useRef();

  useEffect(() => {
    // Clear container and recreate widget div if re-rendering
    if (container.current) {
      container.current.innerHTML = '<div id="tradingview_advanced_chart" class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';
    }
    
    // Create script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    let tvSymbol = 'AAPL';
    let exchangePrefix = '';
    
    if (symbol) {
      if (symbol.endsWith('.NS')) {
        tvSymbol = symbol.replace('.NS', '');
        exchangePrefix = 'NSE:';
      } else if (symbol.endsWith('.BO')) {
        tvSymbol = symbol.replace('.BO', '');
        exchangePrefix = 'BSE:';
      } else {
        tvSymbol = symbol;
      }
    }
    
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${exchangePrefix}${tvSymbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(11, 14, 20, 1)",
        "gridColor": "rgba(42, 46, 57, 0.5)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_advanced_chart",
        "support_host": "https://www.tradingview.com"
      }`;
      
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="card" style={{ height: '600px', padding: '0', overflow: 'hidden' }}>
      <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
      </div>
    </div>
  );
}

export default memo(TradingViewAdvancedChart);
