'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, LogOut, Menu, Search, Settings, Shield, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { NotificationsTray } from '@/components/notifications/NotificationsTray';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/marques', label: 'Rechercheur des pieces' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-epct-green/15 bg-white/95 backdrop-blur dark:border-epct-green/20 dark:bg-epct-dark-bg/95 supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex h-[5.7rem] items-center gap-4 border-b border-epct-green/10 dark:border-white/10">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/img/elite_logo.png"
              alt="EPCT logo"
              width={560}
              height={182}
              className="h-12 w-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert sm:h-[5.45rem]"
              priority
            />
          </Link>

          {/* Mobile search */}
          <div className="flex flex-1 justify-center px-2 sm:px-4 md:hidden">
            <label className="relative block w-full max-w-[16rem]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-epct-ink/45" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="h-9 w-full rounded-full border border-epct-green/20 bg-epct-bg pl-9 pr-3 text-sm text-epct-ink outline-none transition placeholder:text-epct-ink/45 focus:border-epct-green/45"
              />
            </label>
          </div>

          <div className="hidden flex-1 justify-center md:flex">
            <label className="relative block w-full max-w-[30rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-epct-ink/45 dark:text-epct-dark-text/45" />
              <input
                type="search"
                placeholder="Rechercher par catégorie, marque ou article..."
                className="h-10 w-full rounded-full border border-epct-green/20 bg-epct-bg pl-11 pr-4 text-sm text-epct-ink outline-none ring-0 transition placeholder:text-epct-ink/45 focus:border-epct-green/45 dark:border-epct-lime/25 dark:bg-white/5 dark:text-epct-dark-text"
              />
            </label>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 text-epct-dark transition hover:bg-epct-green hover:text-white md:hidden"
              aria-label={mobileMenuOpen ? 'Fermer menu' : 'Ouvrir menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <label className="relative hidden sm:block">
              <select
                aria-label="Langue"
                className="h-9 appearance-none rounded-full border border-epct-green/25 bg-transparent px-3 pr-8 text-xs font-semibold tracking-wide text-epct-ink/75 outline-none dark:border-epct-lime/30 dark:text-epct-dark-text/80"
                defaultValue="fr"
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-epct-ink/55 dark:text-epct-dark-text/60" />
            </label>
            <NotificationsTray mode="frontend" />
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((current) => !current)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 text-epct-dark transition hover:bg-epct-green hover:text-white dark:border-epct-lime/35 dark:text-epct-dark-text dark:hover:bg-epct-lime/20"
                aria-label="Compte"
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
                      Panneau admin
                    </Link>
                    <Link
                      href="/admin/account"
                      className="flex items-center gap-3 border-b border-epct-ink/10 px-4 py-3 text-sm font-medium text-epct-dark transition hover:bg-epct-green/5"
                    >
                      <Settings size={15} />
                      Parametres
                    </Link>
                    <Link
                      href="/admin/logout"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#b42318] transition hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      Deconnexion
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden h-12 items-center gap-6 overflow-x-auto whitespace-nowrap text-xs font-semibold uppercase tracking-[0.13em] text-epct-ink/75 dark:text-epct-dark-text/75 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-epct-green dark:hover:text-epct-lime"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile nav overlay */}
        {mobileMenuOpen && (
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-epct-green/15 bg-white p-4 shadow-xl md:hidden dark:border-epct-green/20 dark:bg-epct-dark-bg">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
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
                <label className="relative block">
                  <select
                    aria-label="Langue"
                    className="h-10 w-full appearance-none rounded-lg border border-epct-green/25 bg-white px-3 pr-8 text-sm font-semibold text-epct-ink outline-none"
                    defaultValue="fr"
                  >
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-epct-ink/55" />
                </label>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
