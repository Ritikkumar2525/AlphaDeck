import { PieChart, TrendingUp, ShieldCheck, ArrowRight, Lock, Activity } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PieChart size={32} className="text-primary-color" />
              <div>
                <h1 className="text-h2">Portfolio Hub</h1>
                <p className="text-secondary">Track all your brokerages and crypto wallets in one place.</p>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', overflow: 'hidden', padding: 0, minHeight: '350px', maxWidth: '640px', margin: '40px auto 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Blurred out background UI */}
            <div style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              padding: '40px', opacity: 0.15, filter: 'blur(4px)', pointerEvents: 'none'
            }}>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
                <div style={{ flex: 1, height: '120px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ flex: 1, height: '120px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}></div>
                <div style={{ flex: 1, height: '120px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}></div>
              </div>
              <div style={{ height: '300px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}></div>
            </div>

            {/* Coming Soon Call to Action */}
            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 212, 126, 0.1)', color: 'var(--color-primary)', marginBottom: '16px' }}>
                <Lock size={20} />
              </div>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                Broker Integrations
              </h2>
              
              <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '24px' }}>
                We are building the ultimate portfolio tracker. Soon, you will be able to securely connect your brokerage accounts (Zerodha, Groww, Robinhood, etc.) to track your real-time performance, analyze asset allocation, and get AI-driven portfolio insights.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', background: 'var(--bg-elevated)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={16} className="text-primary-color" />
                  <span>Bank-grade 256-bit encryption</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <TrendingUp size={16} className="text-primary-color" />
                  <span>Real-time P&L and dividend tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Activity size={16} className="text-primary-color" />
                  <span>AI-powered risk analysis and rebalancing alerts</span>
                </div>
              </div>
            </div>
            </div>
          </div>
      </main>
    </div>
  );
}
