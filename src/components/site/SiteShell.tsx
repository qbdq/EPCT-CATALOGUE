import type { ReactNode } from 'react';
import { LenisProvider } from './LenisProvider';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <div className="min-h-screen bg-epct-bg text-epct-ink">
        <SiteHeader />
        {children}
        <SiteFooter />
      </div>
    </LenisProvider>
  );
}
