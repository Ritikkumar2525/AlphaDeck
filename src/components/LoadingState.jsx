'use client';

import { useState, useEffect } from 'react';

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: 'Connecting to market data sources...', icon: '📡' },
    { text: 'Fetching real-time stock quotes...', icon: '📈' },
    { text: 'Retrieving historical financial statements...', icon: '📊' },
    { text: 'Scanning recent news and market sentiment...', icon: '📰' },
    { text: 'Feeding data to Gemini AI model...', icon: '🧠' },
    { text: 'Generating investment decision and reasoning...', icon: '⚙️' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2200);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111218', borderRadius: '12px', border: '1px solid #2a2b36', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
      <div style={{ background: '#1a1b23', padding: '12px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #2a2b36' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
        </div>
        <div style={{ marginLeft: '16px', color: '#8b8d98', fontSize: '13px', fontFamily: 'monospace' }}>investiq-ai-agent ~ analysis</div>
      </div>
      
      <div style={{ padding: '24px', fontFamily: 'monospace', fontSize: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              opacity: index <= currentStep ? 1 : 0.3,
              transition: 'opacity 0.3s ease'
            }}>
              <span style={{ fontSize: '16px' }}>{step.icon}</span>
              <span style={{ color: index < currentStep ? '#27c93f' : index === currentStep ? '#fff' : '#8b8d98' }}>
                {step.text}
              </span>
              {index === currentStep && (
                <span className="animate-pulse" style={{ color: '#00d47e' }}>_</span>
              )}
              {index < currentStep && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27c93f" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '32px' }}>
          <div style={{ width: '100%', height: '4px', background: '#2a2b36', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#00d47e',
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              transition: 'width 2.2s linear'
            }}></div>
          </div>
          <p style={{ textAlign: 'center', color: '#8b8d98', fontSize: '12px', marginTop: '12px', fontFamily: 'var(--font-inter)' }}>
            This may take 15-30 seconds. AI is crunching the numbers...
          </p>
        </div>
      </div>
    </div>
  );
}
