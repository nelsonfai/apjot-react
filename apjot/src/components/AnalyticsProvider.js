'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, logPageView } from '@/lib/ga4';

const AnalyticsProvider = () => {
  const pathname = usePathname();

  useEffect(() => {
    initGA();
    logPageView(pathname);
  }, [pathname]);

  return null;
};

export default AnalyticsProvider;
