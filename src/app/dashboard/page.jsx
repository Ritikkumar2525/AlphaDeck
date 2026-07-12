'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WelcomeBanner from '@/components/WelcomeBanner';
import { 
  TrendingUp, TrendingDown, Clock, Activity, BarChart2, 
  Globe, Zap, Newspaper, Calendar, ArrowUpRight, ArrowDownRight,
  ChevronRight, CircleDollarSign, Compass, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [marketData, setMarketData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('US');
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('alphadeck_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
    const fetchData = async () => {
      try {
        const [overviewRes, trendingRes, newsRes] = await Promise.all([
          fetch('/api/market-overview').catch(() => null),
          fetch(`/api/trending?region=${activeTab}`).catch(() => null),
          fetch('/api/news').catch(() => null)
        ]);
        
        if (overviewRes?.ok) {
          const data = await overviewRes.json();
          setMarketData(data);
        }
        
        if (trendingRes?.ok) {
          const data = await trendingRes.json();
          setTrending(data);
        }

        if (newsRes?.ok) {
          const data = await newsRes.json();
          setNews(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Effect to fetch trending data when activeTab changes
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`/api/trending?region=${activeTab}`);
        if (res.ok) {
          const data = await res.json();
          setTrending(data);
        }
      } catch (err) {
        console.error('Failed to fetch trending for tab', err);
      }
    };
    fetchTrending();
  }, [activeTab]);

  const isMarketOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const isWeekend = day === 0 || day === 6;
    const isBeforeOpen = hour < 9 || (hour === 9 && minute < 30);
    const isAfterClose = hour >= 16;
    
    return !isWeekend && !isBeforeOpen && !isAfterClose;
  };

  const marketOpen = isMarketOpen();

  const handleQuickAnalyze = (ticker) => {
    router.push(`/analysis/${ticker}`);
  };

  const EmptyState = ({ title, message }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)',
      borderRadius: '8px', border: '1px dashed var(--border-subtle)', height: '100%', gridColumn: '1 / -1'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
        <AlertCircle size={32} />
      </div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{title}</h4>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{message}</p>
    </div>
  );

  const globalIndices = marketData?.indices || [];
  const snapshotData = marketData?.snapshot || [];
  const eventsData = marketData?.events || [];
  const sectorData = marketData?.sectors || [];
  const breadthData = marketData?.breadth || null;

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          
          {/* Top Status Bar */}
          <div className="market-status-bar">
            <div style={{ display: 'flex', gap: '24px' }}>
              <div className="status-indicator">
                <div className={`status-dot ${marketOpen ? 'open' : 'closed'}`}></div>
                <span>US Market: {marketOpen ? 'Open' : 'Closed'}</span>
              </div>
              <div className="status-indicator">
                <div className="status-dot closed"></div>
                <span className="text-muted">Global Markets: Closed</span>
              </div>
            </div>
            <div className="text-sm text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZoneName: 'short' })}</span>
            </div>
          </div>

          {/* Search Hero */}
          <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '20px' }}>
            <h1 className="text-display" style={{ marginBottom: '16px' }}>Global Market Intelligence</h1>
            <p className="text-secondary" style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto 32px' }}>
              Instant AI-powered research and analysis for stocks, forex, and crypto across global markets.
            </p>
            <SearchBar />
          </div>

          <div className="global-dashboard-grid">
            
            {/* Main Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Indices Overview */}
              <div className="widget-card">
                <div className="widget-header">
                  <h3 className="widget-title"><Globe size={18} /> Global Indices</h3>
                  <Link href="/markets" className="text-xs text-primary-color" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View All <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="widget-grid-4">
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="card-glass animate-pulse" style={{ height: '90px' }}></div>)
                  ) : globalIndices.length > 0 ? (
                    globalIndices.map((idx, i) => {
                      const change = idx.changePercent || 0;
                      const isUp = change >= 0;
                      return (
                        <div key={idx.symbol || i} className="card-compact" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="text-sm font-semibold">{idx.name || idx.symbol}</span>
                            <span className="badge" style={{ fontSize: '10px' }}>{idx.region || 'GLOBAL'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                            <span className="text-h3">{idx.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: isUp ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
                            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(change).toFixed(2)}%
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <EmptyState title="Indices Unavailable" message="Global indices integration pending API connection." />
                  )}
                </div>
              </div>

              {/* Trending Stocks Tabs */}
              <div className="widget-card">
                <div className="widget-header" style={{ marginBottom: '0', borderBottom: 'none', paddingBottom: '0' }}>
                  <h3 className="widget-title"><Zap size={18} /> Trending Stocks</h3>
                </div>
                
                <div className="tab-nav">
                  <button className={`tab-btn ${activeTab === 'US' ? 'active' : ''}`} onClick={() => setActiveTab('US')}>US Markets</button>
                  <button className={`tab-btn ${activeTab === 'IN' ? 'active' : ''}`} onClick={() => setActiveTab('IN')}>Indian Markets</button>
                  <button className={`tab-btn ${activeTab === 'CRYPTO' ? 'active' : ''}`} onClick={() => setActiveTab('CRYPTO')}>Crypto</button>
                </div>

                <div className="widget-grid-3">
                  {isLoading || trending.length === 0 ? (
                    Array(6).fill(0).map((_, i) => <div key={i} className="card-glass animate-pulse" style={{ height: '100px' }}></div>)
                  ) : trending.length > 0 ? (
                    trending.slice(0, 6).map(stock => (
                      <div 
                        key={stock.symbol} 
                        className="card-compact"
                        onClick={() => handleQuickAnalyze(stock.symbol)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ fontWeight: 600 }}>{stock.symbol}</h4>
                            <span className="text-xs text-secondary" style={{ display: 'block', maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {stock.name}
                            </span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{stock.price ? `$${stock.price.toFixed(2)}` : '---'}</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: (stock.changePercent || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                              {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState 
                      title={`${activeTab} Market Data Integration`} 
                      message={`Live trending data for ${activeTab === 'IN' ? 'Indian' : activeTab === 'CRYPTO' ? 'Crypto' : 'US'} markets is currently pending API integration.`} 
                    />
                  )}
                </div>
              </div>

              {/* Market Breadth & Sector Performance */}
              <div className="widget-grid-2">
                <div className="widget-card">
                  <div className="widget-header">
                    <h3 className="widget-title"><Activity size={18} /> Global Market Breadth</h3>
                  </div>
                  {isLoading ? (
                     <div className="animate-pulse" style={{ height: '60px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                  ) : breadthData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                          <span className="text-success">Advancing ({breadthData.advancing}%)</span>
                          <span className="text-danger">Declining ({breadthData.declining}%)</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--color-danger)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: `${breadthData.advancing}%`, height: '100%', background: 'var(--color-success)' }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-muted">
                        Based on US, European, and Asian major indices.
                      </p>
                    </div>
                  ) : (
                    <EmptyState title="Market Breadth Unavailable" message="Waiting for market depth data feed." />
                  )}
                </div>

                <div className="widget-card">
                  <div className="widget-header">
                    <h3 className="widget-title"><Compass size={18} /> Sector Heatmap</h3>
                  </div>
                  {isLoading ? (
                     <div className="animate-pulse" style={{ height: '60px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                  ) : sectorData.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {sectorData.map(sector => (
                        <span key={sector.name} className="badge" style={{ 
                          background: sector.change > 0 ? 'rgba(0,212,126,0.2)' : sector.change < 0 ? 'rgba(255,71,87,0.2)' : 'rgba(255,165,2,0.1)', 
                          color: sector.change > 0 ? 'var(--color-success)' : sector.change < 0 ? 'var(--color-danger)' : 'var(--color-warning)' 
                        }}>
                          {sector.name} {sector.change > 0 ? '+' : ''}{sector.change}%
                        </span>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Sector Data Pending" message="Sector performance will appear here once connected." />
                  )}
                </div>
              </div>

              {/* News Feed */}
              <div className="widget-card" style={{ flex: 1 }}>
                <div className="widget-header">
                  <h3 className="widget-title"><Newspaper size={18} /> Market News</h3>
                  <Link href="/news" className="text-xs text-primary-color">All News</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '400px' }}>
                  {isLoading ? (
                     Array(4).fill(0).map((_, i) => <div key={i} className="animate-pulse" style={{ height: '60px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>)
                  ) : news.length > 0 ? (
                    news.slice(0, 5).map((article, idx) => (
                      <a key={idx} href={article.url} target="_blank" rel="noreferrer" style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div className="text-sm" style={{ color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.4 }}>
                          {article.title}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>{article.source}</span>
                          <span>{new Date(article.publishedAt * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <EmptyState title="No Recent News" message="News API returned zero articles or is unavailable." />
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Recent Activity */}
              <div className="widget-card">
                <div className="widget-header">
                  <h3 className="widget-title"><Clock size={18} /> Recent Activity</h3>
                </div>
                {recentSearches.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {recentSearches.slice(0, 5).map((term, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleQuickAnalyze(term)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-surface)'}
                      >
                        <Clock size={16} color="var(--text-muted)" />
                        <span style={{ fontWeight: 500 }}>{term}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="No Recent Activity" message="Search for a stock to see it here." />
                )}
              </div>

              {/* Snapshot */}
              <div className="widget-card">
                <div className="widget-header">
                  <h3 className="widget-title"><CircleDollarSign size={18} /> Snapshot</h3>
                </div>
                {isLoading ? (
                  <div className="animate-pulse" style={{ height: '100px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                ) : snapshotData.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {snapshotData.map(item => (
                      <div key={item.symbol} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div>
                          <div className="text-sm font-semibold">{item.name}</div>
                          <div className="text-xs text-muted">{item.symbol}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div className="text-sm font-mono">{item.price?.toFixed(2)}</div>
                          <div className="text-xs" style={{ color: item.change >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {item.change >= 0 ? '+' : ''}{item.change}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Commodities / Forex Pending" message="Global snapshot data integration is in progress." />
                )}
              </div>



              {/* Economic Calendar */}
              <div className="widget-card">
                <div className="widget-header">
                  <h3 className="widget-title"><Calendar size={18} /> Upcoming Events</h3>
                  <Link href="/calendars" className="text-xs text-primary-color">Calendar</Link>
                </div>
                {isLoading ? (
                   <div className="animate-pulse" style={{ height: '80px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                ) : eventsData.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {eventsData.map((event, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                          <div className="text-xs text-primary-color font-bold">{event.timeStr}</div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{event.title}</div>
                          <div className="text-xs text-muted">{event.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState title="Economic Calendar Unavailable" message="Global events timeline pending integration." />
                )}
              </div>

            </div>
          </div>
          
          <WelcomeBanner />
        </div>
      </main>
    </div>
  );
}
