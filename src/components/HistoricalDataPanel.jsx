'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HistoricalDataPanel({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' }}>
        <p>No historical data available for this ticker.</p>
      </div>
    );
  }

  // Optimize data for rendering (take every 5th point if array is very large)
  const renderData = data.length > 100 ? data.filter((_, i) => i % 5 === 0) : data;

  return (
    <div className="card animate-fade-in" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>1-Year Historical Price</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <AreaChart data={renderData}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={30}
              tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-primary)' }}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Close Price']}
            />
            <Area type="monotone" dataKey="close" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorClose)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
