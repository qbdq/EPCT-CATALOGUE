import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { QuoteCartProvider } from '@/components/catalogue/QuoteCartContext';
import { LocaleProvider, type SiteLocale } from './LocaleProvider';
import { LenisProvider } from './LenisProvider';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

function resolveInitialLocale(value: string | undefined): SiteLocale {
  if (value === 'en' || value === 'ar') return value;
  return 'fr';
}

export async function SiteShell({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = resolveInitialLocale(cookieStore.get('site-locale')?.value);

  return (
    <LenisProvider>
      <LocaleProvider initialLocale={initialLocale}>
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
