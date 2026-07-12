import { Eye } from 'lucide-react';

export default function WatchPage() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Eye size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Watchlist Hub</h1>
              <p className="text-secondary">Monitor your favorite assets and receive real-time alerts.</p>
            </div>
          </div>
          <div className="card-glass" style={{ marginTop: '32px' }}>
            <p className="text-muted" style={{ padding: '60px', textAlign: 'center', fontSize: '1.125rem' }}>
              The advanced watchlist features are currently being upgraded. Your tracked stocks will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
