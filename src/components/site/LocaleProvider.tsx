'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type SiteLocale = 'fr' | 'en' | 'ar';

type LocaleContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
};

const STORAGE_KEY = 'site-locale';
const COOKIE_KEY = 'site-locale';

const LocaleContext = createContext<LocaleContextValue | null>(null);

function resolveLocale(value: string | null | undefined): SiteLocale {
  if (value === 'en' || value === 'ar') return value;
  return 'fr';
}

export function LocaleProvider({
  children,
  initialLocale = 'fr',
}: {
  children: ReactNode;
  initialLocale?: SiteLocale;
}) {
  const [locale, setLocaleState] = useState<SiteLocale>(initialLocale);

  useEffect(() => {
    const storedLocale = resolveLocale(window.localStorage.getItem(STORAGE_KEY));

    if (storedLocale !== locale) {
      setLocaleState(storedLocale);
      document.documentElement.lang = storedLocale;
      document.documentElement.dir = storedLocale === 'ar' ? 'rtl' : 'ltr';
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  function setLocale(nextLocale: SiteLocale) {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    document.cookie = `${COOKIE_KEY}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === 'ar' ? 'rtl' : 'ltr';
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useSiteLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useSiteLocale must be used within LocaleProvider');
  }

  return context;
}
