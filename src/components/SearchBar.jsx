'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, X, TrendingUp, Search as SearchIcon } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();
  const searchContainerRef = useRef(null);

  const trendingSearches = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', market: 'US' },
    { symbol: 'RELIANCE.NS', name: 'Reliance Ind', market: 'IN' },
    { symbol: 'AAPL', name: 'Apple Inc', market: 'US' },
    { symbol: 'TCS.NS', name: 'TCS Ltd', market: 'IN' },
    { symbol: 'BTC-USD', name: 'Bitcoin', market: 'CRYPTO' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('alphadeck_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
    
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim().toUpperCase();
    
    let updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 20);
    setRecentSearches(updated);
    localStorage.setItem('alphadeck_recent_searches', JSON.stringify(updated));
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem('alphadeck_recent_searches', JSON.stringify(updated));
  };

  const handleSubmit = useCallback(() => {
    if (query.trim() && !isLoading) {
      setIsFocused(false);
      saveRecentSearch(query);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/analysis/${encodeURIComponent(query.trim())}`);
      }
    }
  }, [query, onSearch, isLoading, router, recentSearches]);

  const handleRecentClick = (term) => {
    setQuery(term);
    setIsFocused(false);
    saveRecentSearch(term);
    if (onSearch) {
      onSearch(term);
    } else {
      router.push(`/analysis/${encodeURIComponent(term)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const displayRecent = recentSearches;
  const displayTrending = trendingSearches;
  const showDropdown = isFocused && (displayRecent.length > 0 || displayTrending.length > 0);

  return (
    <div ref={searchContainerRef} style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', zIndex: isFocused ? 50 : 10 }}>
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--bg-card)',
        border: `1px solid ${isFocused ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
        borderRadius: '16px', padding: '8px 8px 8px 16px',
        boxShadow: isFocused ? '0 4px 20px rgba(0,212,126,0.1)' : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease',
        position: 'relative',
        zIndex: 2
      }}>
        <SearchIcon size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder="Search global symbols (e.g., AAPL, RELIANCE.NS)..."
          disabled={isLoading}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '16px', outline: 'none' }}
          autoComplete="off"
        />
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="btn-primary"
          style={{ padding: '8px 24px', opacity: (!query.trim() || isLoading) ? 0.5 : 1 }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Analyzing...
            </div>
          ) : (
            'Analyze'
          )}
        </button>
      </div>

      {showDropdown && (
        <div className="card-glass" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          padding: '16px',
          zIndex: 100,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {displayRecent.length > 0 && (
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ padding: '0 8px 8px 8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                Recent Searches
              </div>
              {displayRecent.map(term => (
                <div 
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  style={{
                    padding: '10px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={16} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{term}</span>
                  </div>
                  <button
                    onClick={(e) => removeRecentSearch(e, term)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-danger)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {displayTrending.length > 0 && (
            <div style={{ flex: '1 1 200px' }}>
              <div style={{ padding: '0 8px 8px 8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                Trending Now
              </div>
              {displayTrending.map(item => (
                <div 
                  key={item.symbol}
                  onClick={() => handleRecentClick(item.symbol)}
                  style={{
                    padding: '10px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TrendingUp size={16} color="var(--color-primary)" />
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>{item.symbol}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{item.name}</div>
                    </div>
                  </div>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>{item.market}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
