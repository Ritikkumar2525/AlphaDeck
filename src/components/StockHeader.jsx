'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function StockHeader({ company, stock, decision }) {
  const isUp = stock.change >= 0;
  const color = isUp ? 'var(--color-success)' : 'var(--color-danger)';
  const sign = isUp ? '+' : '';

  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('alphaDeck_watchlist');
      if (stored) {
        const watchlist = JSON.parse(stored);
        if (watchlist.some(item => item.ticker === company.ticker)) {
          setIsWatchlisted(true);
        }
      }
    } catch (e) {
      console.error('Error reading watchlist', e);
    }
  }, [company.ticker]);

  const toggleWatchlist = () => {
    try {
      const stored = localStorage.getItem('alphaDeck_watchlist');
      let watchlist = stored ? JSON.parse(stored) : [];
      
      if (isWatchlisted) {
        watchlist = watchlist.filter(item => item.ticker !== company.ticker);
        setIsWatchlisted(false);
      } else {
        watchlist.push({ 
          ticker: company.ticker, 
          addedAt: Date.now(),
          notified: false
        });
        setIsWatchlisted(true);
      }
      localStorage.setItem('alphaDeck_watchlist', JSON.stringify(watchlist));
      
      // Dispatch a custom event so other components (like NotificationManager) can sync
      window.dispatchEvent(new Event('watchlistUpdated'));
    } catch (e) {
      console.error('Error updating watchlist', e);
    }
  };

  const getDecisionColor = (val) => {
    if (val === 'INVEST') return 'var(--color-success)';
    if (val === 'PASS') return 'var(--color-danger)';
    return 'var(--color-warning, #f59e0b)';
  };

  return (
    <div className="stock-header-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stock-title">
          <div className="subtitle">{company.ticker} • Delayed Quote • {company.currency || 'USD'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1>{company.name} ({company.ticker})</h1>
            <Star 
              size={24} 
              fill={isWatchlisted ? 'var(--color-warning)' : 'none'}
              color={isWatchlisted ? 'var(--color-warning)' : 'var(--text-secondary)'} 
              style={{ cursor: 'pointer', marginTop: '-8px', transition: 'all 0.2s' }} 
              onClick={toggleWatchlist}
            />
          </div>
        </div>
        
        <div className="stock-pricing">
          <span className="price">{stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="change" style={{ color }}>
            {sign}{stock.change.toFixed(2)} ({sign}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          At close: Today
        </div>
      </div>

      {decision && (
        <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-surface)', padding: '12px 24px', borderRadius: '16px', border: `1px solid ${getDecisionColor(decision.decision)}40`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>AI Verdict</p>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: getDecisionColor(decision.decision), margin: 0, letterSpacing: '0.5px' }}>
              {decision.decision || 'HOLD'}
            </h2>
          </div>
          <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0, marginLeft: '4px' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--bg-body)" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke={getDecisionColor(decision.decision)} strokeWidth="4" 
                strokeDasharray={2 * Math.PI * 20} 
                strokeDashoffset={2 * Math.PI * 20 - ((decision.confidence || 0) / 100) * (2 * Math.PI * 20)} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} 
              />
            </svg>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(decision.confidence || 0)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
