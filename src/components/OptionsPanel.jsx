'use client';

export default function OptionsPanel({ options = [] }) {
  if (!options || options.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <p>No options chain data available for this ticker.</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Options Chain (Near Term)</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 8px' }}>Type</th>
              <th style={{ padding: '12px 8px' }}>Strike</th>
              <th style={{ padding: '12px 8px' }}>Expiration</th>
              <th style={{ padding: '12px 8px' }}>Implied Vol</th>
              <th style={{ padding: '12px 8px' }}>Open Int.</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: opt.type === 'CALL' ? 'var(--color-success)' : 'var(--color-danger)',
                    color: '#fff'
                  }}>
                    {opt.type}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', fontWeight: 600 }}>${opt.strike}</td>
                <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{opt.expiration}</td>
                <td style={{ padding: '12px 8px' }}>{opt.impliedVolatility ? `${(opt.impliedVolatility * 100).toFixed(2)}%` : '-'}</td>
                <td style={{ padding: '12px 8px' }}>{opt.openInterest || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
