'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, LogOut, Menu, Search, Settings, Shield, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NotificationsTray } from '@/components/notifications/NotificationsTray';
import { QuoteCartTray } from '@/components/catalogue/QuoteCartTray';
import { useSiteLocale, type SiteLocale } from './LocaleProvider';

type ProductSearchResult = {
  id: string;
  name: string;
  slug: string;
  reference: string;
  imageUrl: string;
  alt: string;
};

const OVERLAY_EVENT = 'epct-overlay-open';

const localeOptions = [
  { value: 'fr', code: 'FR', flag: '/img/countries/france.png', label: 'Francais' },
  { value: 'en', code: 'EN', flag: '/img/countries/united-states.png', label: 'English' },
  { value: 'ar', code: 'AR', flag: '/img/countries/tunisia.png', label: 'Arabic' },
] as const;

const copy = {
  fr: {
    nav: [
      { href: '/', label: 'Accueil' },
      { href: '/marques', label: 'Rechercheur des pieces' },
      { href: '/catalogue', label: 'Catalogue' },
      { href: '/blog', label: 'Blog' },
      { href: '/a-propos', label: 'A propos' },
      { href: '/contact', label: 'Contact' },
    ],
    searchDesktop: 'Rechercher par categorie, marque ou article...',
    searchMobile: 'Rechercher...',
    language: 'Langue',
    openMenu: 'Ouvrir menu',
    closeMenu: 'Fermer menu',
    account: 'Compte',
    adminPanel: 'Panneau admin',
    settings: 'Parametres',
    logout: 'Deconnexion',
    searching: 'Recherche en cours...',
    noResults: 'Aucun produit trouve.',
    viewAll: 'Voir tous les resultats',
  },
  en: {
    nav: [
      { href: '/', label: 'Home' },
      { href: '/marques', label: 'Parts finder' },
      { href: '/catalogue', label: 'Catalogue' },
      { href: '/blog', label: 'Blog' },
      { href: '/a-propos', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
    searchDesktop: 'Search by category, brand or article...',
    searchMobile: 'Search...',
    language: 'Language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    account: 'Account',
    adminPanel: 'Admin panel',
    settings: 'Settings',
    logout: 'Logout',
    searching: 'Searching...',
    noResults: 'No products found.',
    viewAll: 'View all results',
  },
  ar: {
    nav: [
      { href: '/', label: 'الرئيسية' },
      { href: '/marques', label: 'البحث عن القطع' },
      { href: '/catalogue', label: 'الكتالوج' },
      { href: '/blog', label: 'المدونة' },
      { href: '/a-propos', label: 'من نحن' },
      { href: '/contact', label: 'اتصل بنا' },
    ],
    searchDesktop: 'ابحث حسب الفئة او العلامة او المقال...',
    searchMobile: 'ابحث...',
    language: 'اللغة',
    openMenu: 'فتح القائمة',
    closeMenu: 'اغلاق القائمة',
    account: 'الحساب',
    adminPanel: 'لوحة الادارة',
    settings: 'الاعدادات',
    logout: 'تسجيل الخروج',
    searching: 'جاري البحث...',
    noResults: 'لا توجد منتجات مطابقة.',
    viewAll: 'عرض كل النتائج',
  },
} as const;

function SearchBox({
  query,
  placeholder,
  onChange,
  results,
  loading,
  loadingLabel,
  noResultsLabel,
  viewAllLabel,
  onResultClick,
  large = false,
}: {
  query: string;
  placeholder: string;
  onChange: (value: string) => void;
  results: ProductSearchResult[];
  loading: boolean;
  loadingLabel: string;
  noResultsLabel: string;
  viewAllLabel: string;
  onResultClick: () => void;
  large?: boolean;
}) {
  const showDropdown = query.trim().length >= 1;

  return (
    <div className="relative block w-full">
      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-epct-ink/45 dark:text-epct-dark-text/45 ${
          large ? 'left-4 h-4 w-4' : 'left-3 h-4 w-4'
        }`}
      />
      <input
        type="search"
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-full border border-epct-green/20 bg-epct-bg text-sm text-epct-ink outline-none transition placeholder:text-epct-ink/45 focus:border-epct-green/45 dark:border-epct-lime/25 dark:bg-white/5 dark:text-epct-dark-text ${
          large ? 'h-10 pl-11 pr-4' : 'h-9 pl-9 pr-3'
        }`}
      />

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50 min-w-[18rem] overflow-hidden rounded-sm border border-epct-ink/10 bg-white shadow-[0_18px_40px_rgba(16,24,40,0.12)] sm:min-w-0">
          {loading ? (
            <div className="px-4 py-3 text-sm text-epct-ink/62">{loadingLabel}</div>
          ) : results.length ? (
            <>
              <div className="grid">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/catalogue/${result.slug}`}
                    onClick={onResultClick}
                    className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3 border-b border-epct-ink/8 px-3 py-3 transition hover:bg-epct-green/5 last:border-b-0"
                  >
                    <div className="overflow-hidden rounded-sm border border-epct-ink/10 bg-neutral-100">
                      <img src={result.imageUrl} alt={result.alt} className="h-14 w-14 object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-epct-dark">{result.name}</p>
                      <p className="mt-1 truncate text-xs uppercase tracking-[0.08em] text-epct-green/85">
                        Ref. {result.reference}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/catalogue?q=${encodeURIComponent(query)}`}
                onClick={onResultClick}
                className="flex min-h-11 items-center justify-center border-t border-epct-ink/8 bg-[#fcfcfb] px-4 text-sm font-semibold text-epct-green transition hover:bg-epct-green/6"
              >
                {viewAllLabel}
              </Link>
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-epct-ink/62">{noResultsLabel}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { locale, setLocale } = useSiteLocale();
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchRef = useRef<HTMLDivElement | null>(null);
  const currentCopy = copy[locale];
  const currentLocale = localeOptions.find((option) => option.value === locale) ?? localeOptions[0];

  function announceOverlay(kind: string) {
    window.dispatchEvent(new CustomEvent(OVERLAY_EVENT, { detail: { kind } }));
  }

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }

      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }

      const clickedInsideSearch =
        mobileSearchRef.current?.contains(event.target as Node) ||
        desktopSearchRef.current?.contains(event.target as Node);

      if (!clickedInsideSearch) {
        setSearchQuery('');
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  useEffect(() => {
    function onOverlayOpen(event: Event) {
      const detail = (event as CustomEvent<{ kind?: string }>).detail;
      const kind = detail?.kind;

      if (kind !== 'header-search') {
        setSearchQuery('');
        setSearchResults([]);
      }

      if (kind !== 'header-user') {
        setUserMenuOpen(false);
      }

      if (kind !== 'header-language') {
        setLanguageMenuOpen(false);
      }

      if (kind !== 'header-mobile-menu') {
        setMobileMenuOpen(false);
      }
    }

    window.addEventListener(OVERLAY_EVENT, onOverlayOpen as EventListener);
    return () => window.removeEventListener(OVERLAY_EVENT, onOverlayOpen as EventListener);
  }, []);

  useEffect(() => {
    const normalized = searchQuery.trim();

    if (normalized.length < 1) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    announceOverlay('header-search');

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const response = await fetch(
          `/api/product-search?q=${encodeURIComponent(normalized)}&locale=${locale}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          setSearchResults([]);
          return;
        }

        const json = (await response.json()) as { results?: ProductSearchResult[] };
        setSearchResults(Array.isArray(json.results) ? json.results : []);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setSearchResults([]);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [locale, searchQuery]);

  function switchLocale(nextLocale: SiteLocale) {
    setLocale(nextLocale);
    setLanguageMenuOpen(false);
    setMobileMenuOpen(false);
    window.location.reload();
  }

  function handleSearchResultClick() {
    setSearchQuery('');
    setSearchResults([]);
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-epct-green/15 bg-white/95 backdrop-blur dark:border-epct-green/20 dark:bg-epct-dark-bg/95 supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex h-[5.7rem] items-center gap-4 border-b border-epct-green/10 dark:border-white/10">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/img/elite_logo_full.png"
              alt="EPCT logo"
              width={820}
              height={220}
              className="h-10 w-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert sm:h-[5.45rem]"
              priority
            />
          </Link>

          <div className="flex flex-1 justify-center px-2 sm:px-4 md:hidden" ref={mobileSearchRef}>
            <div className="w-full max-w-[20rem]">
              <SearchBox
                query={searchQuery}
                placeholder={currentCopy.searchMobile}
                onChange={setSearchQuery}
                results={searchResults}
                loading={searchLoading}
                loadingLabel={currentCopy.searching}
                noResultsLabel={currentCopy.noResults}
                viewAllLabel={currentCopy.viewAll}
                onResultClick={handleSearchResultClick}
              />
            </div>
          </div>

          <div className="hidden flex-1 justify-center md:flex" ref={desktopSearchRef}>
            <div className="w-full max-w-[30rem]">
              <SearchBox
                query={searchQuery}
                placeholder={currentCopy.searchDesktop}
                onChange={setSearchQuery}
                results={searchResults}
                loading={searchLoading}
                loadingLabel={currentCopy.searching}
                noResultsLabel={currentCopy.noResults}
                viewAllLabel={currentCopy.viewAll}
                onResultClick={handleSearchResultClick}
                large
              />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              onClick={() => {
                const nextOpen = !mobileMenuOpen;
                if (nextOpen) announceOverlay('header-mobile-menu');
                setMobileMenuOpen(nextOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 text-epct-dark transition hover:bg-epct-green hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? currentCopy.closeMenu : currentCopy.openMenu}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div className="relative hidden sm:block" ref={languageMenuRef}>
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !languageMenuOpen;
                  if (nextOpen) announceOverlay('header-language');
                  setLanguageMenuOpen(nextOpen);
                }}
                aria-label={currentCopy.language}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-epct-green/25 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-epct-ink/80 transition hover:border-epct-green/45 dark:border-epct-lime/30 dark:bg-transparent dark:text-epct-dark-text/80"
              >
                <span className="h-4 w-5 overflow-hidden rounded-[2px]">
                  <img
                    src={currentLocale.flag}
                    alt={`${currentLocale.label} flag`}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span>{currentLocale.code}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition ${languageMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {languageMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-32 overflow-hidden rounded-sm border border-epct-ink/10 bg-white shadow-[0_18px_40px_rgba(16,24,40,0.12)]">
                  {localeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => switchLocale(option.value)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition ${
                        option.value === locale
                          ? 'bg-epct-green/8 text-epct-green'
                          : 'text-epct-dark hover:bg-epct-green/5'
                      }`}
                    >
                      <span className="h-4 w-5 overflow-hidden rounded-[2px]">
                        <img src={option.flag} alt={`${option.label} flag`} className="h-full w-full object-cover" />
                      </span>
                      <span>{option.code}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <NotificationsTray mode="frontend" />
            <QuoteCartTray />

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  const nextOpen = !userMenuOpen;
                  if (nextOpen) announceOverlay('header-user');
                  setUserMenuOpen(nextOpen);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 text-epct-dark transition hover:bg-epct-green hover:text-white dark:border-epct-lime/35 dark:text-epct-dark-text dark:hover:bg-epct-lime/20"
                aria-label={currentCopy.account}
              >
                <User size={16} />
              </button>

              {userMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-56 border border-epct-ink/10 bg-white shadow-[0_18px_40px_rgba(16,24,40,0.12)]">
                  <div className="grid">
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 border-b border-epct-ink/10 px-4 py-3 text-sm font-medium text-epct-dark transition hover:bg-epct-green/5"
                    >
                      <Shield size={15} />
                      {currentCopy.adminPanel}
                    </Link>
                    <Link
                      href="/admin/account"
                      className="flex items-center gap-3 border-b border-epct-ink/10 px-4 py-3 text-sm font-medium text-epct-dark transition hover:bg-epct-green/5"
                    >
                      <Settings size={15} />
                      {currentCopy.settings}
                    </Link>
                    <Link
                      href="/admin/logout"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#b42318] transition hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      {currentCopy.logout}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <nav className="hidden h-12 items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-semibold uppercase tracking-[0.13em] text-epct-ink/75 dark:text-epct-dark-text/75 md:flex">
          {currentCopy.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-epct-green dark:hover:text-epct-lime"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {mobileMenuOpen ? (
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-epct-green/15 bg-white p-4 shadow-xl md:hidden dark:border-epct-green/20 dark:bg-epct-dark-bg">
            <div className="flex flex-col gap-3">
              {currentCopy.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold uppercase tracking-wide text-epct-ink/80 transition hover:bg-epct-green/10 hover:text-epct-green dark:text-epct-dark-text/80 dark:hover:text-epct-lime"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-epct-green/10 pt-3 sm:hidden">
                <div className="grid gap-2">
                  {localeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => switchLocale(option.value)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        option.value === locale
                          ? 'border-epct-green bg-epct-green/8 text-epct-green'
                          : 'border-epct-green/20 text-epct-ink'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-5 overflow-hidden rounded-[2px]">
                          <img src={option.flag} alt={`${option.label} flag`} className="h-full w-full object-cover" />
                        </span>
                        <span>{option.label}</span>
                      </span>
                      <span className="text-xs uppercase">{option.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
