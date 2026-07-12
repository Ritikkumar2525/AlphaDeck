'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CalendarsPage() {
  const [activeDay, setActiveDay] = useState(1);

  const [days, setDays] = useState([]);
  const [events, setEvents] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/economic-calendar')
      .then(res => res.json())
      .then(data => {
        if (data.days && data.events) {
          setDays(data.days);
          setEvents(data.events);
          
          // Set active day to today (if mon-fri), otherwise default to monday
          const today = new Date().getDay() - 1;
          if (today >= 0 && today <= 4) {
            setActiveDay(today);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return { bg: 'var(--color-danger-muted)', text: 'var(--color-danger)' };
      case 'medium': return { bg: 'var(--color-warning-muted)', text: 'var(--color-warning)' };
      case 'low': return { bg: 'var(--color-success-muted)', text: 'var(--color-success)' };
      default: return { bg: 'var(--bg-elevated)', text: 'var(--text-secondary)' };
    }
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <CalendarIcon size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Economic Calendar</h1>
              <p className="text-secondary">Track upcoming market events, earnings, and economic indicators.</p>
            </div>
          </div>

          {/* Date Selector */}
          <div className="card-glass" style={{ marginBottom: '24px', padding: '16px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {days.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDay(d.id)}
                style={{
                  flex: '1 0 120px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: activeDay === d.id ? 'var(--color-primary-muted)' : 'transparent',
                  border: `1px solid ${activeDay === d.id ? 'var(--color-primary)' : 'var(--border-default)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ 
                  color: activeDay === d.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '1.125rem'
                }}>{d.day}</span>
                <span style={{ 
                  color: activeDay === d.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontSize: '0.875rem'
                }}>{d.date}</span>
              </button>
            ))}
          </div>

          {/* Events List */}
          <div className="card-glass" style={{ padding: '0', minHeight: '300px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '40px' }}>
                 <div className="animate-pulse text-secondary">Loading real-time calendar...</div>
              </div>
            ) : events[activeDay]?.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 No major economic events scheduled for this day.
              </div>
            ) : (
              events[activeDay]?.map((event, idx) => {
                const impactStyle = getImpactColor(event.impact);
                
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      padding: '24px',
                      borderBottom: idx === events[activeDay].length - 1 ? 'none' : '1px solid var(--border-default)',
                      gap: '24px',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                      <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>{event.time.split(' ')[0]}</span>
                      <span className="text-muted text-xs">{event.time.split(' ')[1]}</span>
                    </div>
                    
                    <div style={{ width: '2px', height: '40px', background: 'var(--border-default)' }}></div>
  
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                          {event.country}
                        </span>
                        <span className="badge" style={{ background: impactStyle.bg, color: impactStyle.text, border: `1px solid ${impactStyle.text}40` }}>
                          {event.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 500 }}>{event.event}</h3>
                    </div>
  
                    <div style={{ display: 'flex', gap: '32px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-muted text-xs">Actual</span>
                        <span style={{ fontWeight: 600, color: event.status === 'upcoming' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                          {event.actual}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-muted text-xs">Forecast</span>
                        <span style={{ fontWeight: 600 }}>{event.forecast}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className="text-muted text-xs">Previous</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{event.previous}</span>
                      </div>
                    </div>
  
                    <div style={{ marginLeft: '16px' }}>
                      {event.status === 'past' ? (
                        <CheckCircle2 size={24} className="text-success-color" style={{ opacity: 0.5 }} />
                      ) : (
                        <Clock size={24} className="text-secondary" style={{ opacity: 0.5 }} />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
