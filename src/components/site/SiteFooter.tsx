import Link from 'next/link';
import Image from 'next/image';

const brands = ['Putzmeister', 'Schwing', 'CIFA', 'Turukmixer', 'Zoomlion'];
const categories = [
  { label: 'Toupies / Malaxeurs', href: '/catalogue?category=toupie' },
  { label: 'Pompes à béton', href: '/catalogue?category=pompe-beton' },
  { label: 'Centrales à béton', href: '/catalogue?category=centrale-beton' },
];
const quickLinks = [
  { label: 'Accueil', href: '/' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Blog', href: '/blog' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-epct-green/20 bg-epct-dark text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Image
            src="/img/elite_logo.png"
            alt="EPCT logo"
            width={110}
            height={36}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Pièces pour centrales et pompes à béton en Tunisie. Disponibilité, réactivité et
            accompagnement terrain.
          </p>
          <a
            href="https://wa.me/21658348436"
            className="mt-5 inline-flex items-center gap-2 rounded bg-epct-lime px-4 py-2 text-xs font-semibold uppercase tracking-wider text-epct-ink"
          >
            WhatsApp — 58 348 436
          </a>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">Catégories</p>
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-sm text-white/70 transition hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-3 mt-6 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">Marques</p>
          <ul className="space-y-1.5">
            {brands.map((b) => (
              <li key={b} className="text-sm text-white/70">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">Navigation</p>
          <ul className="space-y-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">Contact</p>
          <address className="not-italic space-y-2 text-sm text-white/70">
            <p>
              <span className="text-white/40 text-xs uppercase tracking-wider">Tél</span>
              <br />
              <a href="tel:+21658348436" className="hover:text-white transition">+216 58 348 436</a>
            </p>
            <p>
              <span className="text-white/40 text-xs uppercase tracking-wider">Email</span>
              <br />
              <a href="mailto:epctunisie@gmail.com" className="hover:text-white transition">
                epctunisie@gmail.com
              </a>
            </p>
            <p>
              <span className="text-white/40 text-xs uppercase tracking-wider">Localisation</span>
              <br />
              Tunisie
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-10">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EPCT — Tous droits réservés
          </p>
          <p className="text-xs text-white/30">
            Pièces pour centrales & pompes à béton · Tunisie
          </p>
        </div>
      </div>
    </footer>
  );
}
