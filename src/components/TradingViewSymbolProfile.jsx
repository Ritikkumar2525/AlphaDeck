'use client';
import React, { useEffect, useRef, memo } from 'react';

function TradingViewSymbolProfile({ symbol }) {
  const container = useRef();

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>';
    }
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js";
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
      </div>
    </div>
  );
}

export default memo(TradingViewSymbolProfile);
