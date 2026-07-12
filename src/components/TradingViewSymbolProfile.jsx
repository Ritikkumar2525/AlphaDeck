'use client';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewSymbolProfile({ symbol }) {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '';
    }
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
    script.type = "text/javascript";
    script.async = true;
    
    const tvSymbol = symbol ? symbol.replace('.NS', '') : 'AAPL';
    const exchangePrefix = symbol && symbol.includes('.NS') ? 'NSE:' : '';
    
    script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "colorTheme": "dark",
        "isTransparent": true,
        "symbol": "${exchangePrefix}${tvSymbol}",
        "locale": "en"
      }`;
      
    container.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="card" style={{ height: '450px', padding: '16px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px' }}>Symbol Profile</h3>
      <div className="tradingview-widget-container" ref={container} style={{ height: "calc(100% - 40px)", width: "100%" }}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(TradingViewSymbolProfile);
