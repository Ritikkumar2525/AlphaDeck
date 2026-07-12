import './globals.css';
import NavigationWrapper from '@/components/NavigationWrapper';
import NotificationManager from '@/components/NotificationManager';

import ConsentBanner from '@/components/ConsentBanner';

export const metadata = {
  title: 'AlphaDeck — Premium Investment Research Terminal',
  description: 'AI-powered investment research terminal. Analyze stocks, get AI-driven investment decisions.',
  keywords: ['AI investment', 'stock analysis', 'investment research', 'AlphaDeck'],
  authors: [{ name: 'AlphaDeck' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavigationWrapper />
        <NotificationManager />
        <ConsentBanner />
        <div style={{ flex: 1, display: 'flex' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
