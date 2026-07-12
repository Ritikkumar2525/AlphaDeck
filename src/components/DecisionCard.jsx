'use client';

export default function DecisionCard({ decision }) {
  if (!decision) return null;

  const decisionValue = decision.decision || 'HOLD';
  const confidence = typeof decision.confidence === 'number' && !isNaN(decision.confidence) 
    ? decision.confidence 
    : 0;

  const colorMap = {
    INVEST: 'var(--color-success)',
    HOLD: 'var(--color-warning, #f59e0b)',
    PASS: 'var(--color-danger)',
  };
  const color = colorMap[decisionValue] || 'var(--text-muted)';

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  const strengths = decision.strengths || [];
  const risks = decision.risks || [];

  return (
    <div className="card" style={{ border: `1px solid ${color}40`, background: `linear-gradient(180deg, ${color}08 0%, var(--bg-card) 100%)`, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth="6" />
            <circle cx="40" cy="40" r={radius} fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{confidence}%</span>
          </div>
        </div>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: color, marginBottom: '8px', letterSpacing: '1px' }}>
            {decisionValue}
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {decision.summary || 'No summary available.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1 }}>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            SWOT: Strengths & Opportunities
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {strengths.length > 0 ? strengths.map((strength, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--color-success)', marginTop: '2px' }}>•</span> {strength}
              </li>
            )) : (
              <li style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No strengths data available</li>
            )}
          </ul>
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Risk Matrix (Threats & Weaknesses)
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {risks.length > 0 ? risks.map((risk, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--color-danger)', marginTop: '2px' }}>•</span> {risk}
              </li>
            )) : (
              <li style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No risk data available</li>
            )}
          </ul>
        </div>
      </div>

      {(decision.timeHorizon || decision.priceTarget) && (
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '24px' }}>
          {decision.timeHorizon && (
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Time Horizon</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{decision.timeHorizon}</span>
            </div>
          )}
          {decision.priceTarget && (
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Price Target</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{decision.priceTarget}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
