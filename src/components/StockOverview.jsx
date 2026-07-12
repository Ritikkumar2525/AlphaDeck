'use client';

export default function StockOverview({ stock }) {
  if (!stock) return null;

  const isPositive = stock.change >= 0;

  const formatNumber = (num) => {
    if (num === undefined || num === null) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  const formatLargeNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num}`;
  };

  const formatVolume = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  const stats = [
    { label: 'Open', value: formatNumber(stock.open) },
    { label: 'Prev Close', value: formatNumber(stock.previousClose) },
    { label: '52W High', value: formatNumber(stock.weekHigh52) },
    { label: '52W Low', value: formatNumber(stock.weekLow52) },
    { label: 'Volume', value: formatVolume(stock.volume) },
    { label: 'Market Cap', value: formatLargeNumber(stock.marketCap) },
  ];

  return (
    <div className="card">
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '20px' }}>Market Overview</h3>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <span style={{ fontSize: '40px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatNumber(stock.currentPrice)}
          </span>
          <span style={{ fontSize: '18px', fontWeight: 600, color: isPositive ? 'var(--color-success)' : 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isPositive ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            )}
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Real-time Data</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ background: 'var(--bg-body)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
