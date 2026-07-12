'use client';

export default function StatisticsPanel({ stats = {} }) {
  if (!stats || Object.keys(stats).length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <p>No extended statistics available for this ticker.</p>
      </div>
    );
  }

  // Format helper
  const formatNum = (num) => {
    if (typeof num !== 'number') return num || '-';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const keysToDisplay = [
    { label: "Forward P/E", key: "forwardPE" },
    { label: "PEG Ratio", key: "pegRatio" },
    { label: "Price to Book", key: "priceToBook" },
    { label: "Profit Margin", key: "profitMargins" },
    { label: "Beta", key: "beta" },
    { label: "52 Week Change", key: "52WeekChange" },
    { label: "Enterprise Value", key: "enterpriseValue" },
    { label: "Short Ratio", key: "shortRatio" },
  ];

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Key Statistics</h3>
      <div className="grid-2">
        {keysToDisplay.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <span style={{ fontWeight: 600 }}>
              {stats[item.key] !== undefined 
                ? (typeof stats[item.key] === 'number' && item.label.includes('Margin') 
                   ? `${(stats[item.key] * 100).toFixed(2)}%` 
                   : formatNum(stats[item.key])) 
                : '-'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
