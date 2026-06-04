import type { ReactNode } from 'react';
import { QuoteCartProvider } from '@/components/catalogue/QuoteCartContext';
import { LocaleProvider } from './LocaleProvider';
import { LenisProvider } from './LenisProvider';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <LocaleProvider>
        <QuoteCartProvider>
          <div className="min-h-screen bg-epct-bg text-epct-ink">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </QuoteCartProvider>
      </LocaleProvider>
    </LenisProvider>
  );
}
