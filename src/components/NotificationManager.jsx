'use client';
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export default function NotificationManager() {
  const [showModal, setShowModal] = useState(false);
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check if we've already asked for permission
    const savedPermission = localStorage.getItem('alphaDeck_notification_permission');
    if (!savedPermission) {
      // Small delay to let the app load before popping the modal
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setPermission(savedPermission);
    }
  }, []);

  // 1-hour Watchlist Notification Check
  useEffect(() => {
    const checkWatchlistNotifications = () => {
      try {
        if (Notification.permission !== 'granted') return;
        
        const stored = localStorage.getItem('alphaDeck_watchlist');
        if (!stored) return;
        
        let watchlist = JSON.parse(stored);
        let updated = false;
        const ONE_HOUR = 60 * 60 * 1000;
        
        watchlist = watchlist.map(item => {
          if (!item.notified && item.addedAt && (Date.now() - item.addedAt >= ONE_HOUR)) {
            new Notification('AlphaDeck Watchlist Alert', {
              body: `It's been an hour! Check how ${item.ticker} is performing since you added it.`,
              icon: '/favicon.ico'
            });
            updated = true;
            return { ...item, notified: true };
          }
          return item;
        });
        
        if (updated) {
          localStorage.setItem('alphaDeck_watchlist', JSON.stringify(watchlist));
        }
      } catch (e) {
        console.error('Error checking watchlist notifications', e);
      }
    };

    // Check immediately on mount, then every minute
    checkWatchlistNotifications();
    const intervalId = setInterval(checkWatchlistNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleAccept = async () => {
    if ('Notification' in window) {
      const p = await Notification.requestPermission();
      setPermission(p);
      localStorage.setItem('alphaDeck_notification_permission', p);
      if (p === 'granted') {
        new Notification('AlphaDeck Notifications Enabled', {
          body: 'You will now receive important market alerts.',
          icon: '/favicon.ico'
        });
      }
    } else {
      // Fallback if browser doesn't support Notifications API
      localStorage.setItem('alphaDeck_notification_permission', 'granted');
    }
    setShowModal(false);
  };

  const handleDecline = () => {
    localStorage.setItem('alphaDeck_notification_permission', 'denied');
    setPermission('denied');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div className="card-glass" style={{ width: '90%', maxWidth: '400px', padding: '24px', position: 'relative' }}>
        <button 
          onClick={handleDecline}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '50%' }}>
            <Bell size={24} className="text-primary-color" />
          </div>
          <h2 className="text-h3">Enable Notifications?</h2>
        </div>
        <p className="text-secondary" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
          Stay ahead of the market. Allow AlphaDeck to send you alerts for market open, close, earnings, and breaking news.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDecline} className="search-btn" style={{ flex: 1, background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
            Not Now
          </button>
          <button onClick={handleAccept} className="search-btn text-primary-color" style={{ flex: 1, fontWeight: 600 }}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
