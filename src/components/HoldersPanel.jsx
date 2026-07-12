'use client';

export default function HoldersPanel({ holders = [] }) {
  if (!holders || holders.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <p>No institutional ownership data available for this ticker.</p>
      </div>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>Top Institutional Holders</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '13px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 8px' }}>Institution</th>
              <th style={{ padding: '12px 8px' }}>Shares Held</th>
              <th style={{ padding: '12px 8px' }}>% Ownership</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((holder, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{holder.name}</td>
                <td style={{ padding: '12px 8px' }}>{holder.shares ? holder.shares.toLocaleString() : '-'}</td>
                <td style={{ padding: '12px 8px', color: 'var(--color-primary)' }}>
                  {holder.percentage ? `${(holder.percentage * 100).toFixed(2)}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
