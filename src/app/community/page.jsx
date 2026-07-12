import { Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Users size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">AlphaDeck Community</h1>
              <p className="text-secondary">Discuss market trends and share analysis with other investors.</p>
            </div>
          </div>
          <div className="card-glass" style={{ marginTop: '32px' }}>
            <p className="text-muted" style={{ padding: '60px', textAlign: 'center', fontSize: '1.125rem' }}>
              The community forums are currently in beta testing and will be available soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
