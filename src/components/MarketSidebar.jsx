'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import Link from 'next/link';

export default function MarketSidebar() {
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch('/api/trending');
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        console.error('Failed to fetch trending', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTrending();
  }, []);

  return (
    <div className="analysis-sidebar-right">
      <div className="market-panel">
        <h3>Trending tickers</h3>
        <div className="trending-list">
          {isLoading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
              Loading live markets...
            </div>
          ) : trending.map(t => {
            const isUp = t.change >= 0;
            const color = isUp ? 'var(--color-success)' : 'var(--color-danger)';
            return (
              <Link href={`/analysis/${t.symbol}`} className="trending-item" key={t.symbol} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', cursor: 'pointer' }}>
                <div className="trending-info" style={{ maxWidth: '40%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <div className="symbol">{t.symbol}</div>
                  <div className="name" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.name}</div>
                </div>
                
                <div style={{ width: '40px', height: '24px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(t.chart || [1, 2, 1.5]).map(val => ({ val }))}>
                      <YAxis domain={['dataMin', 'dataMax']} hide />
                      <Line type="monotone" dataKey="val" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="trending-price">
                  <div>{t.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div style={{ color, fontSize: '12px' }}>
                    {isUp ? '+' : ''}{t.change?.toFixed(2)} ({isUp ? '+' : ''}{t.changePercent?.toFixed(2)}%)
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="market-panel">
        <h3>Portfolio</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Sign in to access your portfolio</p>
        <button className="btn-primary" style={{ width: '100%', borderRadius: 'var(--radius-full)' }}>Sign in</button>
      </div>
    </div>
  );
}
