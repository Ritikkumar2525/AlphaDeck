'use client';
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

export default function NotificationManager() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    // Check if we've already asked for permission
    const savedPermission = localStorage.getItem('alphaDeck_notification_permission');
    if (savedPermission) {
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
          icon: '/icon.svg'
        });
      }
    } else {
      // Fallback if browser doesn't support Notifications API
      localStorage.setItem('alphaDeck_notification_permission', 'granted');
    }
  };

  const handleDecline = () => {
    localStorage.setItem('alphaDeck_notification_permission', 'denied');
    setPermission('denied');
  };

  return null;
}
