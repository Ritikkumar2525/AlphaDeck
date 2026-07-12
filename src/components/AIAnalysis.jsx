'use client';

export default function AIAnalysis({ decision }) {
  if (!decision) return null;

  const reasoning = decision.reasoning || [];

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish': return 'var(--color-success)';
      case 'bearish': return 'var(--color-danger)';
      default: return 'var(--color-warning, #f59e0b)';
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>AI Scorecard</h3>
        <span className="badge badge-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 12"/><path d="M12 12l8.9-4.5"/></svg>
          Powered by AlphaDeck AI
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {reasoning.length > 0 ? (
          reasoning.map((item, index) => (
            <div key={index} style={{ background: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: getSentimentColor(item.sentiment), background: `${getSentimentColor(item.sentiment)}20`, padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                  {item.sentiment}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {item.assessment}
              </p>
            </div>
          ))
        ) : (
          <div style={{ background: 'var(--bg-body)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
              Detailed AI reasoning breakdown is not available for this analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
