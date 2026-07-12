'use client';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NotificationBell from './NotificationBell';
import WolfLogo from './WolfLogo';

export default function TopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/analysis/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/markets', label: 'Markets' },
    { href: '/news', label: 'News' },
    { href: '/research', label: 'Research' },
    { href: '/screeners', label: 'Screeners' },
    { href: '/calendars', label: 'Calendars' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  return (
    <nav className="top-navigation">
      <div className="nav-left">
        <Link href="/dashboard" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WolfLogo size={32} />
          <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '1px' }}>ALPHA<span style={{ color: 'var(--color-primary)' }}>DECK</span></span>
        </Link>
      </div>
      
      <div className="nav-right" style={{ flex: 1, justifyContent: 'flex-end', display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div className="nav-links" style={{ display: 'flex', gap: '24px' }}>
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              className={pathname === link.href ? 'active-nav-link' : ''}
              style={{
                color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: pathname === link.href ? 600 : 500
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {pathname !== '/dashboard' && (
          <div className="search-mini">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Quote Lookup" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        )}
        
        <div className="user-actions">
          <NotificationBell />
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle action-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay card-glass" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          borderTop: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-md)'
        }}>
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: pathname === link.href ? 'var(--bg-hover)' : 'transparent',
                color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
