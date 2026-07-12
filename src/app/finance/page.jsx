import { Landmark } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Landmark size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Personal Finance</h1>
              <p className="text-secondary">Manage your wealth, track expenses, and plan your financial future.</p>
            </div>
          </div>
          <div className="card-glass" style={{ marginTop: '32px' }}>
            <p className="text-muted" style={{ padding: '60px', textAlign: 'center', fontSize: '1.125rem' }}>
              Our personal finance tools are currently being developed. Stay tuned for updates!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
