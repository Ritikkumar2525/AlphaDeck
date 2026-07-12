'use client';

import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
      })
      .then(d => {
        if (Array.isArray(d)) setNews(d);
        else setError(d.error || 'Failed to fetch news');
      })
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <main className="main-content">
        <div className="main-content-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '28px 0', marginBottom: '8px' }}>
            <Newspaper size={32} className="text-primary-color" />
            <div>
              <h1 className="text-h2">Market News</h1>
              <p className="text-secondary">Latest financial news and updates from top sources.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '32px' }}>
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="card-glass animate-pulse" style={{ height: '120px' }}></div>
                ))}
              </div>
            ) : error ? (
              <div className="card-glass" style={{ borderLeft: '4px solid var(--color-danger)' }}>
                <p className="text-danger">{error}</p>
              </div>
            ) : news.length === 0 ? (
              <div className="card-glass">
                <p className="text-secondary text-center">No news available at the moment.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Top Story */}
                {news.length > 0 && (
                  <a 
                    href={news[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-glass"
                    style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: '24px', 
                      textDecoration: 'none', 
                      color: 'inherit',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      padding: '24px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-highlight)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-default)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {news[0].image && (
                      <div style={{ flex: '1 1 300px', height: '240px', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                        <img 
                          src={news[0].image} 
                          alt={news[0].title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: '1 1 300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className="badge" style={{ background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>Top Story</span>
                        <span className="badge" style={{ background: 'var(--bg-elevated)' }}>{news[0].source}</span>
                        <span className="text-xs text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {new Date(news[0].publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h2 className="text-display" style={{ fontSize: '1.5rem', marginBottom: '12px', lineHeight: '1.3' }}>{news[0].title}</h2>
                      <p className="text-secondary text-sm" style={{ 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden',
                        marginBottom: '20px'
                      }}>
                        {news[0].summary}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                        Read full article <ExternalLink size={16} className="text-primary-color" />
                      </div>
                    </div>
                  </a>
                )}

                {/* Latest News Grid */}
                <div>
                  <h3 className="text-h3" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--color-primary)', borderRadius: '50%' }}></div>
                    Latest Stories
                  </h3>
                  <div className="grid-4" style={{ gap: '20px' }}>
                    {news.slice(1).map((item, idx) => (
                      <a 
                        key={idx} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="card-glass"
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          textDecoration: 'none', 
                          color: 'inherit',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          padding: '16px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-primary-muted)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-default)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        {item.image && (
                          <div style={{ width: '100%', height: '140px', position: 'relative', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '12px' }}>
                            <img 
                              src={item.image} 
                              alt={item.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              onError={(e) => e.target.style.display = 'none'}
                            />
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                            <span className="badge" style={{ background: 'var(--bg-elevated)', fontSize: '10px' }}>{item.source}</span>
                            <span className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={10} />
                              {new Date(item.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', lineHeight: '1.4' }}>{item.title}</h4>
                          <p className="text-secondary text-sm" style={{ 
                            display: '-webkit-box', 
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden',
                            marginTop: 'auto',
                            marginBottom: '16px'
                          }}>
                            {item.summary}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontSize: '0.8125rem', fontWeight: 600, marginTop: 'auto' }}>
                            Read article <ExternalLink size={12} />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
