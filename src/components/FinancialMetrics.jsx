'use client';

export default function FinancialMetrics({ financials }) {
  if (!financials) return null;

  const getPeHealth = (pe) => {
    if (!pe) return { status: 'neutral', color: 'var(--text-muted)' };
    if (pe > 0 && pe < 20) return { status: 'good', color: 'var(--color-success)' };
    if (pe >= 20 && pe < 30) return { status: 'okay', color: 'var(--color-warning)' };
    return { status: 'concern', color: 'var(--color-danger)' };
  };

  const getMarginHealth = (margin) => {
    if (!margin) return { status: 'neutral', color: 'var(--text-muted)' };
    if (margin > 20) return { status: 'good', color: 'var(--color-success)' };
    if (margin > 10) return { status: 'okay', color: 'var(--color-warning)' };
    return { status: 'concern', color: 'var(--color-danger)' };
  };

  const getDebtHealth = (debt) => {
    if (debt === undefined || debt === null) return { status: 'neutral', color: 'var(--text-muted)' };
    if (debt < 1) return { status: 'good', color: 'var(--color-success)' };
    if (debt < 2) return { status: 'okay', color: 'var(--color-warning)' };
    return { status: 'concern', color: 'var(--color-danger)' };
  };

  const metrics = [
    { label: 'P/E Ratio', value: financials.peRatio?.toFixed(2) || 'N/A', health: getPeHealth(financials.peRatio) },
    { label: 'EPS', value: financials.eps ? `$${financials.eps.toFixed(2)}` : 'N/A', health: { status: 'neutral', color: 'var(--color-primary)' } },
    { label: 'Debt/Equity', value: financials.debtToEquity?.toFixed(2) || 'N/A', health: getDebtHealth(financials.debtToEquity) },
    { label: 'Current Ratio', value: financials.currentRatio?.toFixed(2) || 'N/A', health: getDebtHealth(2 - (financials.currentRatio || 0)) },
    { label: 'Gross Margin', value: financials.grossMargin ? `${financials.grossMargin.toFixed(1)}%` : 'N/A', health: getMarginHealth(financials.grossMargin) },
    { label: 'Oper. Margin', value: financials.operatingMargin ? `${financials.operatingMargin.toFixed(1)}%` : 'N/A', health: getMarginHealth(financials.operatingMargin) },
    { label: 'ROE', value: financials.roe ? `${financials.roe.toFixed(1)}%` : 'N/A', health: getMarginHealth(financials.roe) },
    { label: 'Free Cash Flow', value: financials.freeCashFlow ? `$${(financials.freeCashFlow / 1e9).toFixed(1)}B` : 'N/A', health: { status: 'neutral', color: 'var(--color-primary)' } },
  ];

  return (
    <div className="card">
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '20px' }}>Financial Health</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: 'var(--bg-body)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: m.health.color }}></div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{m.label}</p>
            <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
