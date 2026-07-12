'use client';

import { useState, useEffect } from 'react';
import { Filter, TrendingUp, TrendingDown, Activity, ExternalLink, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default function ScreenersPage() {
  const [activeTab, setActiveTab] = useState('gainers');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScreenerData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/screeners?type=${activeTab}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching screener:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreenerData();
  }, [activeTab]);

  const tabs = [
    { id: 'gainers', label: 'Top Gainers', icon: <TrendingUp size={16} /> },
    { id: 'losers', label: 'Top Losers', icon: <TrendingDown size={16} /> },
    { id: 'active', label: 'Most Active', icon: <Activity size={16} /> }
  ];

  const formatNumber = (num) => {
    if (!num) return '-';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Filter size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Global Screeners</h1>
              <p className="text-secondary">Discover market movers across international markets.</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '24px', 
            borderBottom: '1px solid var(--border-default)',
            paddingBottom: '16px'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
                  border: `1px solid ${activeTab === tab.id ? 'var(--color-primary)' : 'var(--border-default)'}`,
                  fontWeight: 600,
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="card-glass" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem' }}>Symbol</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Change</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>% Change</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Volume</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Market Cap</th>
                  <th style={{ padding: '16px', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '4px' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '150px', height: '24px', borderRadius: '4px' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '4px', marginLeft: 'auto' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '4px', marginLeft: 'auto' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '4px', marginLeft: 'auto' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '80px', height: '24px', borderRadius: '4px', marginLeft: 'auto' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '80px', height: '24px', borderRadius: '4px', marginLeft: 'auto' }}></div></td>
                      <td style={{ padding: '16px' }}><div className="skeleton-pulse" style={{ width: '32px', height: '32px', borderRadius: '50%', margin: '0 auto' }}></div></td>
                    </tr>
                  ))
                ) : (
                  data.map((stock, idx) => {
                    const isPositive = stock.change >= 0;
                    const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
                    const bg = isPositive ? 'var(--color-success-muted)' : 'var(--color-danger-muted)';
                    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

                    return (
                      <tr 
                        key={stock.symbol} 
                        style={{ 
                          borderBottom: idx === data.length - 1 ? 'none' : '1px solid var(--border-default)',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td style={{ padding: '16px', fontWeight: 600 }}>{stock.symbol}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                          <div style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            maxWidth: '200px' 
                          }}>
                            {stock.shortName}
                          </div>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 500 }}>
                          ${stock.price?.toFixed(2) || '-'}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color }}>
                          {stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2) || '-'}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <span className="badge" style={{ background: bg, color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Icon size={12} />
                            {stock.changePercent?.toFixed(2) || '-'}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatNumber(stock.volume)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                          {formatNumber(stock.marketCap)}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <Link 
                            href={`/analysis/${stock.symbol}`}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--bg-elevated)',
                              color: 'var(--text-primary)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                              e.currentTarget.style.color = '#000';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                              e.currentTarget.style.color = 'var(--text-primary)';
                            }}
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
