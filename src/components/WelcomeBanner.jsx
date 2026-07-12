'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import Link from 'next/link';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenWelcome = localStorage.getItem('alphadeck_cookie_consent');
    if (!hasSeenWelcome) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem('alphadeck_cookie_consent', 'accepted');
  };
  
  const handleDecline = () => {
    setIsVisible(false);
    localStorage.setItem('alphadeck_cookie_consent', 'declined');
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="cookie-banner" style={{
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-strong)',
      padding: '20px 0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      animation: 'slideUp 0.5s var(--ease-out) forwards'
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: '1 1 300px' }}>
          <div style={{
            background: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Welcome to AlphaDeck
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              We use cookies to offer a better browsing experience, analyze site traffic, and personalize content. By clicking "Accept Cookies", you consent to our use of cookies.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/privacy" style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            textDecoration: 'underline',
            marginRight: '8px'
          }}>
            Learn More
          </Link>
          <button 
            onClick={handleDecline}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 16px',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="btn-primary"
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            Accept Cookies
          </button>
        </div>
        
        <button 
          onClick={handleDecline}
          style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
