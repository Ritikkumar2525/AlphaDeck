'use client';

export default function CompanyHeader({ company, decision }) {
  if (!company) return null;

  const isInvest = decision?.decision === 'INVEST';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{company.name}</h1>
          <span className="badge badge-outline">{company.ticker}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', margin: 0 }}>
          {company.sector} {company.industry ? `• ${company.industry}` : ''}
        </p>
      </div>

      {decision && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--bg-card)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Verdict</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`badge ${isInvest ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '16px', padding: '4px 12px' }}>
                {decision.decision}
              </span>
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }}></div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {decision.confidence}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
