'use client';

export default function NewsPanel({ news }) {
  if (!news || news.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 16px', opacity: 0.5 }}>
          <path d="M19 11V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6"/>
          <path d="M19 19v-4h-4"/>
          <path d="M8 11h6"/>
          <path d="M8 15h4"/>
        </svg>
        <p>No recent news found for this stock.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSentimentDot = (sentiment) => {
    let color = 'var(--text-muted)';
    if (sentiment === 'positive') color = 'var(--color-success)';
    if (sentiment === 'negative') color = 'var(--color-danger)';
    return <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} title={sentiment}></div>;
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Recent News & Sentiment</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
        {news.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-body)',
              borderRadius: '12px', border: '1px solid var(--border-subtle)',
              textDecoration: 'none', transition: 'border-color 0.2s ease',
              alignItems: 'flex-start'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-muted)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ marginTop: '6px' }}>
              {getSentimentDot(item.sentiment)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                  {item.title}
                </h4>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.summary}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{item.source}</span>
                <span>•</span>
                <span>{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
