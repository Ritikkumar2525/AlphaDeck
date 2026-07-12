'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import StockHeader from '@/components/StockHeader';
import AdvancedChart from '@/components/AdvancedChart';
import StockSidebar from '@/components/StockSidebar';
import MarketSidebar from '@/components/MarketSidebar';
import StockOverview from '@/components/StockOverview';
import FinancialMetrics from '@/components/FinancialMetrics';
import RevenueChart from '@/components/RevenueChart';
import AIAnalysis from '@/components/AIAnalysis';
import DecisionCard from '@/components/DecisionCard';
import LoadingState from '@/components/LoadingState';
import NewsPanel from '@/components/NewsPanel';
import HistoricalDataPanel from '@/components/HistoricalDataPanel';
import OptionsPanel from '@/components/OptionsPanel';
import HoldersPanel from '@/components/HoldersPanel';
import StatisticsPanel from '@/components/StatisticsPanel';
import ProfilePanel from '@/components/ProfilePanel';
import TradingViewAdvancedChart from '@/components/TradingViewAdvancedChart';
import TradingViewTechnicals from '@/components/TradingViewTechnicals';
import TradingViewSymbolProfile from '@/components/TradingViewSymbolProfile';

export default function AnalysisPage() {
  const params = useParams();
  const ticker = params.ticker ? decodeURIComponent(params.ticker) : '';
  
  const [activeTab, setActiveTab] = useState('Summary');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  useEffect(() => {
    if (ticker) {
      handleSearch(ticker);
    }
  }, [ticker]);

  const handleSearch = async (companyName) => {
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName }),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setErrorCode(errData.errorCode || null);
        throw new Error(errData.error || `Analysis failed (HTTP ${res.status})`);
      }
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorIcon = (code) => {
    switch (code) {
      case 'INVALID_TICKER':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning, #f59e0b)" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        );
    }
  };

  const getErrorColor = (code) => {
    if (code === 'INVALID_TICKER') return 'var(--color-warning, #f59e0b)';
    return 'var(--color-danger)';
  };

  return (
    <div className="analysis-layout">
      {/* 1. Left Navigation Sidebar */}
      <StockSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 2. Main Center Content */}
      <main className="analysis-main">
        {/* We keep the search bar at the top of the main area for quick lookups */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {error && (
          <div className="card animate-fade-in" style={{
            borderColor: `${getErrorColor(errorCode)}40`,
            background: `${getErrorColor(errorCode)}08`,
            marginTop: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ marginTop: '2px', flexShrink: 0 }}>
                {getErrorIcon(errorCode)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: getErrorColor(errorCode), marginBottom: '4px' }}>
                  {errorCode === 'INVALID_TICKER' ? 'Stock Not Found' :
                   errorCode === 'AI_BUSY' ? 'Analysis Service Busy' :
                   'Analysis Failed'}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div style={{ marginTop: '48px' }}>
            <LoadingState />
          </div>
        )}

        {result && !isLoading && (
          <div className="animate-fade-in" style={{ marginTop: '32px' }}>
            <StockHeader company={result.company} stock={result.stock} decision={result.decision} />
            
            {/* Dynamic Content based on active tab */}
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {activeTab === 'Summary' && (
                <>
                  <AdvancedChart stock={result.stock} historicalData={result.historicalData} setActiveTab={setActiveTab} />
                  <div className="grid-2">
                    <StockOverview stock={result.stock} />
                    <ProfilePanel company={result.company} />
                  </div>
                  <DecisionCard decision={result.decision} />
                </>
              )}

              {activeTab === 'Analysis' && (
                <AIAnalysis decision={result.decision} />
              )}

              {activeTab === 'Financials' && (
                <>
                  <FinancialMetrics financials={result.financials} />
                  <RevenueChart financials={result.financials} />
                </>
              )}

              {activeTab === 'News' && (
                <NewsPanel news={result.news || []} />
              )}

              {activeTab === 'Historical Data' && (
                <HistoricalDataPanel data={result.historicalData || []} />
              )}

              {activeTab === 'Options' && (
                <OptionsPanel options={result.options || []} />
              )}

              {activeTab === 'Holders' && (
                <HoldersPanel holders={result.holders || []} />
              )}

              {activeTab === 'Statistics' && (
                <StatisticsPanel stats={result.statistics || {}} />
              )}

              {activeTab === 'Profile' && (
                <ProfilePanel company={result.company || {}} />
              )}

              {activeTab === 'Chart' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Keep the original custom chart */}
                  <AdvancedChart stock={result.stock} historicalData={result.historicalData} />
                  
                  <div style={{ padding: '24px 0', borderTop: '1px solid var(--border-subtle)', marginTop: '8px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>TradingView Pro Charts</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <TradingViewAdvancedChart symbol={result.stock.ticker || result.company.ticker} />
                      
                      <div className="grid-2">
                        <TradingViewTechnicals symbol={result.stock.ticker || result.company.ticker} />
                        <TradingViewSymbolProfile symbol={result.stock.ticker || result.company.ticker} />
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>
          </div>
        )}
      </main>

      {/* 3. Right Market Context Sidebar */}
      <MarketSidebar />
    </div>
  );
}
