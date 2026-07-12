'use client';

export default function ProfilePanel({ company = {} }) {
  return (
    <div className="card animate-fade-in" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 600 }}>
          {company.ticker ? company.ticker.substring(0, 1) : '?'}
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>{company.name}</h2>
          <span style={{ color: 'var(--text-secondary)' }}>{company.ticker} • {company.exchange || 'Market'}</span>
        </div>
      </div>
      
      <div className="grid-2" style={{ marginBottom: '32px' }}>
        <div style={{ background: 'var(--background-color)', padding: '16px', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 4px 0' }}>Sector</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{company.sector || 'N/A'}</p>
        </div>
        <div style={{ background: 'var(--background-color)', padding: '16px', borderRadius: '8px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 4px 0' }}>Industry</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{company.industry || 'N/A'}</p>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Business Description</h3>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {company.description && company.description !== 'No description available.' 
          ? company.description 
          : `${company.name} is a company operating in the ${company.industry || 'general'} industry within the ${company.sector || 'broader'} sector. Detailed company descriptions are actively sourced from market data providers.`}
      </p>
    </div>
  );
}
