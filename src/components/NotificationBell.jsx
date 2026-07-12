'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle, Info, Zap } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'AlphaDeck 2.0 is Live',
    message: 'Welcome to the new premium research terminal. Faster, smarter, and completely redesigned.',
    type: 'feature',
    date: new Date().toISOString()
  },
  {
    id: 'notif-2',
    title: 'Multi-Provider Engine',
    message: 'Our market data engine now automatically cascades across 8 providers to ensure you never miss a tick.',
    type: 'update',
    date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'notif-3',
    title: 'AI Analysis Upgrade',
    message: 'The AI backend now supports multiple LLM providers for robust fallback analysis.',
    type: 'ai',
    date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load dismissed notifications from localStorage
    const saved = localStorage.getItem('alphadeck_dismissed_notifications');
    const dismissedIds = saved ? JSON.parse(saved) : [];
    setDismissed(dismissedIds);
    
    // Filter out dismissed notifications
    setNotifications(INITIAL_NOTIFICATIONS.filter(n => !dismissedIds.includes(n.id)));

    // Close dropdown on click outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDismiss = (e, id) => {
    e.stopPropagation();
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem('alphadeck_dismissed_notifications', JSON.stringify(newDismissed));
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    const allIds = INITIAL_NOTIFICATIONS.map(n => n.id);
    setDismissed(allIds);
    localStorage.setItem('alphadeck_dismissed_notifications', JSON.stringify(allIds));
    setNotifications([]);
    setIsOpen(false);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'feature': return <Zap size={16} style={{ color: 'var(--color-primary)' }} />;
      case 'update': return <CheckCircle size={16} style={{ color: 'var(--color-info)' }} />;
      case 'ai': return <Info size={16} style={{ color: 'var(--color-warning)' }} />;
      default: return <Bell size={16} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) return 'Today';
    if (diff < 172800000) return 'Yesterday';
    return `${Math.floor(diff / 86400000)} days ago`;
  };

  return (
    <div className="notification-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className="action-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-secondary)' }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--color-danger)',
            borderRadius: '50%',
            border: '2px solid var(--bg-surface)'
          }}></span>
        )}
      </button>

      {isOpen && (
        <div className="card-glass dropdown-menu" style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '320px',
          padding: '0',
          zIndex: 50,
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-default)' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                onClick={markAllRead}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                You're all caught up!
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} style={{ 
                  padding: '16px', 
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {getIcon(notif.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{notif.title}</h4>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{formatDate(notif.date)}</span>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {notif.message}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDismiss(e, notif.id)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
