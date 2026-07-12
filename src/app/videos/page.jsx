import { PlayCircle } from 'lucide-react';

export default function VideosPage() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <PlayCircle size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">AlphaDeck Videos</h1>
              <p className="text-secondary">Watch exclusive market analysis, interviews, and tutorials.</p>
            </div>
          </div>
          <div className="card-glass" style={{ marginTop: '32px' }}>
            <p className="text-muted" style={{ padding: '60px', textAlign: 'center', fontSize: '1.125rem' }}>
              The video library is currently under construction. Stay tuned for exciting content.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
