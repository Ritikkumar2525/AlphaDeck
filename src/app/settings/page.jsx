'use client';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('alphaDeck_theme') || 'dark';
    const savedNotifs = localStorage.getItem('alphaDeck_notifications') === 'true';
    setTheme(savedTheme);
    setNotifications(savedNotifs);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('alphaDeck_theme', newTheme);
  };

  const handleNotifsChange = (newNotifs) => {
    setNotifications(newNotifs);
    localStorage.setItem('alphaDeck_notifications', newNotifs);
  };

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <h1 className="text-h2">Settings</h1>
            <p className="text-secondary">Manage your local preferences.</p>
          </div>
          <div className="card-glass" style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div>
              <h3 className="text-h3" style={{ marginBottom: '12px' }}>Theme</h3>
              <select 
                value={theme} 
                onChange={e => handleThemeChange(e.target.value)}
                style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            <div>
              <h3 className="text-h3" style={{ marginBottom: '12px' }}>Notifications</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={e => handleNotifsChange(e.target.checked)}
                />
                Enable Market Notifications
              </label>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
