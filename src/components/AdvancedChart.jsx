'use client';
import { useState, useMemo } from 'react';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdvancedChart({ stock, historicalData, setActiveTab }) {
  const [timeframe, setTimeframe] = useState('1D');
  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'All'];

  // If no historical data is provided, generate a beautiful mock dataset for visualization
  const chartData = useMemo(() => {
    // If real data exists and we are not forcing 1D mock (since real data is daily)
    if (historicalData && historicalData.length > 0 && timeframe !== '1D') {
      const mapped = historicalData.map(d => ({
        ...d,
        time: d.time || d.date,
        price: d.price !== undefined ? d.price : d.close
      }));

      const now = new Date();
      let cutoff = new Date(0);
      
      if (timeframe === '1M') cutoff = new Date(now.setMonth(now.getMonth() - 1));
      else if (timeframe === '6M') cutoff = new Date(now.setMonth(now.getMonth() - 6));
      else if (timeframe === 'YTD') cutoff = new Date(now.getFullYear(), 0, 1);
      else if (timeframe === '1Y') cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
      else if (timeframe === '5Y') cutoff = new Date(now.setFullYear(now.getFullYear() - 5));
      else if (timeframe === '5D') cutoff = new Date(now.setDate(now.getDate() - 5));

      const filtered = mapped.filter(d => new Date(d.time) >= cutoff);
      
      // Downsample for large datasets (e.g. 5Y, All) to prevent Recharts animation freezes
      if (filtered.length > 250) {
        const step = Math.ceil(filtered.length / 250);
        return filtered.filter((_, i) => i % step === 0 || i === filtered.length - 1);
      }
      return filtered;
    }
    
    // Generate mock data mimicking an intraday chart
    const data = [];
    let currentPrice = (stock.currentPrice || 100) * 0.95; // start lower
    const points = timeframe === '1D' ? 78 : 30; // ~1 point per 5 mins for 6.5 hours
    
    let now = new Date();
    now.setHours(9, 30, 0, 0); // 9:30 AM
    
    for (let i = 0; i < points; i++) {
      const volatility = currentPrice * 0.002;
      currentPrice = currentPrice + (Math.random() - 0.45) * volatility;
      
      data.push({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: Number(currentPrice.toFixed(2)),
        open: Number((currentPrice - Math.random() * volatility).toFixed(2)),
        high: Number((currentPrice + Math.random() * volatility).toFixed(2)),
        low: Number((currentPrice - Math.random() * volatility).toFixed(2)),
        volume: Math.floor(Math.random() * 100000)
      });
      now = new Date(now.getTime() + 5 * 60000); // add 5 mins
    }
    // ensure last point matches current price
    data[data.length - 1].price = stock.currentPrice;
    data[data.length - 1].close = stock.currentPrice;
    
    return data;
  }, [stock.currentPrice, historicalData, timeframe]);

  const isUp = stock.change >= 0;
  const strokeColor = isUp ? 'var(--color-success)' : 'var(--color-danger)';
  const fillColor = isUp ? 'rgba(0, 212, 126, 0.2)' : 'rgba(255, 71, 87, 0.2)';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '13px',
          minWidth: '150px'
        }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Date: <span style={{ color: 'var(--text-primary)', float: 'right' }}>{data.time}</span></div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Close: <span style={{ color: 'var(--text-primary)', float: 'right', fontWeight: 600 }}>{data.price}</span></div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Open: <span style={{ color: 'var(--text-primary)', float: 'right' }}>{data.open || data.price}</span></div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>High: <span style={{ color: 'var(--text-primary)', float: 'right' }}>{data.high || data.price}</span></div>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Low: <span style={{ color: 'var(--text-primary)', float: 'right' }}>{data.low || data.price}</span></div>
          <div style={{ color: 'var(--text-secondary)' }}>Volume: <span style={{ color: 'var(--text-primary)', float: 'right' }}>{data.volume ? data.volume.toLocaleString() : '--'}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      
      {/* Chart Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {timeframes.map(tf => (
            <span 
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{ 
                fontSize: '14px', 
                fontWeight: timeframe === tf ? 600 : 500, 
                color: timeframe === tf ? 'var(--color-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                background: timeframe === tf ? 'var(--color-primary-muted)' : 'transparent',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {tf}
            </span>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab && setActiveTab('Chart')}
            style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            Advanced Chart
          </button>
          <button 
            onClick={() => setActiveTab && setActiveTab('Chart')}
            style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
            AlphaSpace Chart
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div style={{ height: '400px', width: '100%', padding: '24px 24px 0 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} minTickGap={20} />
            
            {/* Price Axis */}
            <YAxis 
              yAxisId="price"
              domain={['auto', 'auto']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} 
              orientation="right"
              dx={10}
              tickFormatter={(val) => val.toFixed(2)}
            />
            
            {/* Hidden Volume Axis to keep bars at the bottom */}
            <YAxis 
              yAxisId="volume"
              domain={[0, 'dataMax * 4']} 
              hide={true} 
            />

            <Tooltip content={<CustomTooltip />} />
            
            {/* Volume Graph */}
            <Bar yAxisId="volume" dataKey="volume" fill="var(--text-muted)" opacity={0.3} maxBarSize={15} />

            {/* Price Graph */}
            <Area 
              yAxisId="price"
              type="monotone" 
              dataKey="price" 
              stroke={strokeColor} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              isAnimationActive={true}
              animationDuration={800}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Previous Close</span>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{stock.previousClose?.toFixed(2) || (stock.currentPrice - stock.change).toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Day's Range</span>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{stock.weekLow52?.toFixed(2) || '--'} - {stock.weekHigh52?.toFixed(2) || '--'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Market Cap (intraday)</span>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{stock.marketCap ? (stock.marketCap / 1e12).toFixed(3) + 'T' : '--'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Volume</span>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{stock.volume ? stock.volume.toLocaleString() : '--'}</span>
        </div>
      </div>
    </div>
  );
}
