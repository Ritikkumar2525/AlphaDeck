'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownRight, Search, Trash2 } from 'lucide-react';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadWatchlist = () => {
      try {
        const stored = localStorage.getItem('alphaDeck_watchlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWatchlist(parsed);
          fetchWatchlistData(parsed.map(item => item.ticker));
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        console.error('Error loading watchlist', e);
        setIsLoading(false);
      }
    };

    loadWatchlist();

    // Listen for updates from other tabs/components
    window.addEventListener('watchlistUpdated', loadWatchlist);
    return () => window.removeEventListener('watchlistUpdated', loadWatchlist);
  }, []);

  const fetchWatchlistData = async (symbols) => {
    if (!symbols || symbols.length === 0) {
      setData([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(`/api/watchlist?symbols=${symbols.join(',')}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = (e, ticker) => {
    e.stopPropagation(); // Prevent row click
    try {
      const updated = watchlist.filter(item => item.ticker !== ticker);
      setWatchlist(updated);
      localStorage.setItem('alphaDeck_watchlist', JSON.stringify(updated));
      setData(data.filter(item => item.symbol !== ticker));
      window.dispatchEvent(new Event('watchlistUpdated'));
    } catch (error) {
      console.error('Error removing from watchlist', error);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '-';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <h1 className="text-h2">Watchlist</h1>
            <p className="text-secondary">Track your favorite assets globally.</p>
          </div>

          <div className="card-glass" style={{ overflowX: 'auto', minHeight: '300px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px' }}>
                <div className="animate-pulse" style={{ height: '40px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}></div>
                <div className="animate-pulse" style={{ height: '40px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}></div>
                <div className="animate-pulse" style={{ height: '40px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-sm)' }}></div>
              </div>
            ) : data.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px 24px', gap: '16px' }}>
                <Search size={48} color="var(--text-muted)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500 }}>Your watchlist is empty</h3>
                <p className="text-secondary" style={{ textAlign: 'center', maxWidth: '400px' }}>
                  Search for companies and click the star icon to add them to your watchlist.
                </p>
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    const searchInput = document.querySelector('input[type="text"]');
                    if (searchInput) searchInput.focus();
                  }}
                  style={{ marginTop: '16px' }}
                >
                  Search Stocks
                </button>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Symbol</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Name</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Price</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Change</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>% Change</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Volume</th>
                    <th style={{ padding: '16px', fontWeight: 500 }}>Market Cap</th>
                    <th style={{ padding: '16px', fontWeight: 500, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((stock, idx) => {
                    const isPositive = stock.change >= 0;
                    const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
                    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

                    return (
                      <tr 
                        key={stock.symbol} 
                        style={{ 
                          borderBottom: idx === data.length - 1 ? 'none' : '1px solid var(--border-default)',
                          transition: 'background-color 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => router.push(`/analysis/${stock.symbol}`)}
                      >
                        <td style={{ padding: '16px', fontWeight: 600 }}>{stock.symbol}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{stock.shortName}</td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>
                          ${stock.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '16px', color, fontWeight: 500 }}>
                          {isPositive ? '+' : ''}{stock.change?.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span className="badge" style={{ 
                            background: isPositive ? 'var(--color-success-muted)' : 'var(--color-danger-muted)',
                            color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Icon size={14} />
                            {Math.abs(stock.changePercent || 0).toFixed(2)}%
                          </span>
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{formatNumber(stock.volume)}</td>
                        <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{formatNumber(stock.marketCap)}</td>
                        <td style={{ padding: '16px', textAlign: 'right' }}>
                          <button 
                            onClick={(e) => removeFromWatchlist(e, stock.symbol)}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '8px',
                              borderRadius: 'var(--radius-sm)',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = 'var(--color-danger)';
                              e.currentTarget.style.background = 'var(--color-danger-muted)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = 'var(--text-muted)';
                              e.currentTarget.style.background = 'transparent';
                            }}
                            title="Remove from Watchlist"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
