'use client';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewTechnicals({ symbol }) {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
    }
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    
    const tvSymbol = symbol ? symbol.replace('.NS', '') : 'AAPL';
    const exchangePrefix = symbol && symbol.includes('.NS') ? 'NSE:' : '';
    
    script.innerHTML = `
      {
        "interval": "1D",
        "width": "100%",
        "isTransparent": true,
        "height": "100%",
        "symbol": "${exchangePrefix}${tvSymbol}",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark"
      }`;
      
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="card" style={{ height: '450px', padding: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Technical Analysis</h3>
      <div className="tradingview-widget-container" ref={container} style={{ height: "calc(100% - 40px)", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(TradingViewTechnicals);
