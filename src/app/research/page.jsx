'use client';
import { useState, useEffect } from 'react';
import { FileText, ArrowRight, Download, Clock, Star, Lock, X } from 'lucide-react';

export default function ResearchPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/research')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReports(data);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <FileText size={32} className="text-primary-color" />
              <div>
                <h1 className="text-h2">Curated Research</h1>
                <p className="text-secondary">Deep dive into premium AI-generated and expert research reports.</p>
              </div>
            </div>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} /> Upgrade to AlphaDeck Pro
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {isLoading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="card-glass animate-pulse" style={{ height: '350px', padding: 0 }}>
                  <div style={{ height: '160px', background: 'var(--bg-hover)' }}></div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '24px', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                    <div style={{ height: '16px', background: 'var(--bg-hover)', borderRadius: '4px', width: '80%' }}></div>
                    <div style={{ height: '16px', background: 'var(--bg-hover)', borderRadius: '4px', width: '60%' }}></div>
                  </div>
                </div>
              ))
            ) : reports.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>
                 No research reports available at the moment.
              </div>
            ) : (
              reports.map((report) => (
                <div 
                  key={report.id} 
                  className="card-glass" 
                  onClick={() => setSelectedReport(report)}
                  style={{ 
                    padding: 0, 
                    overflow: 'hidden', 
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                {/* Report Cover / Graphic */}
                <div style={{ 
                  height: '160px', 
                  background: report.gradient,
                  position: 'relative',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ 
                    background: 'rgba(0,0,0,0.4)', 
                    backdropFilter: 'blur(4px)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {report.sector}
                  </span>
                  {report.premium && (
                    <span style={{ 
                      background: 'rgba(0,0,0,0.4)', 
                      backdropFilter: 'blur(4px)',
                      padding: '6px',
                      borderRadius: '50%',
                      color: 'var(--color-warning)'
                    }} title="AlphaDeck Pro Required">
                      <Lock size={16} />
                    </span>
                  )}
                </div>

                {/* Report Details */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 }}>
                    {report.title}
                  </h3>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', lineHeight: 1.6, flex: 1 }}>
                    {report.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--border-default)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {report.readTime}
                      </span>
                      <span>{report.date}</span>
                    </div>
                    <button style={{ 
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}>
                      Read <ArrowRight size={16} className="text-primary-color" />
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>

          {/* Modal */}
          {selectedReport && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
              <div className="card-glass" style={{ width: '90%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>

                <div style={{ marginBottom: '24px' }}>
                  {selectedReport.premium ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--color-warning-muted)', color: 'var(--color-warning)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '16px' }}>
                      <Lock size={16} /> Premium Report
                    </div>
                  ) : (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--color-primary-muted)', color: 'var(--color-primary)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '16px' }}>
                      <FileText size={16} /> Free Report
                    </div>
                  )}
                  <h2 className="text-h3" style={{ marginBottom: '8px' }}>{selectedReport.title}</h2>
                  <p className="text-secondary">{selectedReport.description}</p>
                </div>

                {selectedReport.premium ? (
                  <div style={{ background: 'var(--bg-elevated)', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-default)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Unlock with AlphaDeck Pro</h3>
                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                      Get unlimited access to institutional-grade research, proprietary AI models, and real-time alerts.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 600, borderRadius: 'var(--radius-full)', padding: '10px 24px' }}>
                        <Star size={18} /> Upgrade Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-elevated)', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-default)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '8px' }}>Download Ready</h3>
                    <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '24px' }}>
                      This report is available as a PDF download for your convenience.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#000', fontWeight: 600, borderRadius: 'var(--radius-full)', padding: '10px 24px' }} onClick={() => {
                        alert('Downloading report PDF...');
                        setSelectedReport(null);
                      }}>
                        <Download size={18} /> Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
