'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarketsPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/market-overview')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleQuickAnalyze = (ticker) => {
    router.push(`/analysis/${ticker}`);
  };

  const renderTable = (items, title, icon) => (
    <div className="card-glass" style={{ flex: 1, minWidth: '300px' }}>
      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        {icon} {title}
      </h3>
      {isLoading ? (
        <div className="animate-pulse" style={{ height: '200px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items?.map(item => (
            <div 
              key={item.symbol}
              onClick={() => handleQuickAnalyze(item.symbol)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                border: '1px solid transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{item.symbol}</div>
                <div className="text-xs text-secondary" style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 500 }}>${item.price?.toFixed(2) || '---'}</div>
                <div className={`text-xs ${item.changePercent >= 0 ? 'text-success' : 'text-danger'}`} style={{ color: item.changePercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
          {!items?.length && <p className="text-sm text-secondary">No data available.</p>}
        </div>
      )}
    </div>
  );

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Globe size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Markets Overview</h1>
              <p className="text-secondary">Global indices and market movers.</p>
            </div>
          </div>
          
          <h2 className="text-h3" style={{ marginBottom: '16px', marginTop: '32px' }}>Major Indices</h2>
          <div className="grid-4 section-spacing">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="card-glass animate-pulse" style={{ height: '100px' }}></div>)
            ) : (
              data?.indices?.map(index => (
                <div key={index.symbol} className="card-glass">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontWeight: 600 }}>{index.name}</h3>
                  </div>
                  <p className="metric-value" style={{ fontSize: '1.5rem' }}>{index.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <span className={`badge ${index.changePercent >= 0 ? 'badge-success' : 'badge-danger'}`}>
                      {index.changePercent >= 0 ? '+' : ''}{index.changePercent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '24px' }}>
            {renderTable(data?.gainers, "Top Gainers", <TrendingUp size={20} className="text-primary-color" />)}
            {renderTable(data?.losers, "Top Losers", <TrendingDown size={20} color="var(--color-danger)" />)}
            {renderTable(data?.active, "Most Active", <Activity size={20} className="text-primary-color" />)}
          </div>
        </div>
      </main>
    </div>
  );
}
