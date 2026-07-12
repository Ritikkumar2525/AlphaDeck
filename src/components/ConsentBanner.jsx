'use client';

import { useState, useEffect } from 'react';

export default function ConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the consent
    const hasConsented = localStorage.getItem('alphadeck_consent');
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('alphadeck_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('alphadeck_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-default)',
        padding: '20px 24px',
        boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1 1 600px' }}>
          <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: '1.6', margin: 0 }}>
            <strong style={{ color: 'var(--color-primary)' }}>Terms & Policy Notification:</strong> By continuing to use AlphaDeck, you agree to our <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Terms of Service</a>. 
            You also acknowledge that our updated <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Privacy Policy</a> applies. 
            We and our partners use cookies and similar technologies to personalize your experience, provide premium market data, and analyze platform usage.
          </p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', gap: '12px' }}>
          <button 
            onClick={handleDecline}
            style={{ 
              padding: '12px 24px', 
              fontSize: '0.9375rem', 
              fontWeight: 600,
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            style={{ 
              padding: '12px 24px', 
              fontSize: '0.9375rem', 
              fontWeight: 600,
              background: 'var(--color-primary)',
              color: '#000', // Explicitly dark text for contrast against bright primary color
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer'
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
