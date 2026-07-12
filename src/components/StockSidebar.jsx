'use client';
import { useState } from 'react';

const TABS = [
  'Summary',
  'News',
  'Chart',
  'Statistics',
  'Historical Data',
  'Profile',
  'Financials',
  'Analysis',
  'Options',
  'Holders'
];

export default function StockSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="analysis-sidebar-left">
      <nav className="stock-nav-menu">
        {TABS.map(tab => (
          <div 
            key={tab}
            className={`stock-nav-item ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </nav>
    </div>
  );
}
