import Link from 'next/link';
import Image from 'next/image';
import { DarkModeToggle } from './DarkModeToggle';

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/catalogue', label: 'Catalogue' },
  { href: '/blog', label: 'Blog' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-epct-green/15 bg-white/95 backdrop-blur dark:bg-epct-dark-bg/95 dark:border-epct-green/20 supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-36 w-full max-w-7xl items-center gap-6 px-5 md:px-10">

        {/* Logo — left-anchored */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/img/elite_logo.png"
            alt="EPCT logo"
            width={560}
            height={182}
            className="h-[7.5rem] w-auto object-contain mix-blend-multiply dark:mix-blend-normal dark:brightness-0 dark:invert"
            priority
          />
        </Link>

        {/* Nav — centered */}
        <nav className="flex flex-1 items-center justify-center gap-6 text-xs font-semibold uppercase tracking-[0.15em] text-epct-ink/70 dark:text-epct-dark-text/70">
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

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <DarkModeToggle />
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded border border-epct-green/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-epct-dark transition hover:bg-epct-green hover:text-white dark:border-epct-lime/30 dark:text-epct-dark-text dark:hover:bg-epct-lime/20"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </header>
  );
}
