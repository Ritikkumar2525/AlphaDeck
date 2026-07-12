'use client';

import { usePathname } from 'next/navigation';
import TopNavigation from './TopNavigation';

export default function NavigationWrapper() {
  const pathname = usePathname();
  
  if (pathname === '/') {
    return null;
  }
  
  return <TopNavigation />;
}
