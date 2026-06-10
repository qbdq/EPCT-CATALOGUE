'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSiteLocale } from './LocaleProvider';

const brands = ['Putzmeister', 'Schwing', 'CIFA', 'Turukmixer', 'Zoomlion'];

export function SiteFooter() {
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      description:
        'Pieces pour centrales et pompes a beton en Tunisie. Disponibilite, reactivite et accompagnement terrain.',
      whatsapp: 'WhatsApp - 58 348 436',
      categoriesTitle: 'Categories',
      categories: [
        { label: 'Toupies / Malaxeurs', href: '/catalogue?category=toupie' },
        { label: 'Pompes a beton', href: '/catalogue?category=pompe-beton' },
        { label: 'Centrales a beton', href: '/catalogue?category=centrale-beton' },
      ],
      brandsTitle: 'Marques',
      navigationTitle: 'Navigation',
      quickLinks: [
        { label: 'Accueil', href: '/' },
        { label: 'Catalogue', href: '/catalogue' },
        { label: 'Blog', href: '/blog' },
        { label: 'A propos', href: '/a-propos' },
        { label: 'Contact', href: '/contact' },
      ],
      contactTitle: 'Contact',
      phone: 'Tel',
      email: 'Email',
      location: 'Localisation',
      locationValue: 'Tunisie',
      rights: 'Tous droits reserves',
      footerTagline: 'Pieces pour centrales & pompes a beton · Tunisie',
    },
    en: {
      description:
        'Spare parts for batching plants and concrete pumps in Tunisia. Availability, responsiveness and field support.',
      whatsapp: 'WhatsApp - 58 348 436',
      categoriesTitle: 'Categories',
      categories: [
        { label: 'Mixers', href: '/catalogue?category=toupie' },
        { label: 'Concrete pumps', href: '/catalogue?category=pompe-beton' },
        { label: 'Batching plants', href: '/catalogue?category=centrale-beton' },
      ],
      brandsTitle: 'Brands',
      navigationTitle: 'Navigation',
      quickLinks: [
        { label: 'Home', href: '/' },
        { label: 'Catalogue', href: '/catalogue' },
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '/a-propos' },
        { label: 'Contact', href: '/contact' },
      ],
      contactTitle: 'Contact',
      phone: 'Phone',
      email: 'Email',
      location: 'Location',
      locationValue: 'Tunisia',
      rights: 'All rights reserved',
      footerTagline: 'Parts for batching plants & concrete pumps · Tunisia',
    },
    ar: {
      description:
        'قطع غيار لمحطات الخرسانة ومضخات الخرسانة في تونس. توفر وسرعة استجابة ومرافقة ميدانية.',
      whatsapp: 'واتساب - 58 348 436',
      categoriesTitle: 'الفئات',
      categories: [
        { label: 'الخلاطات', href: '/catalogue?category=toupie' },
        { label: 'مضخات الخرسانة', href: '/catalogue?category=pompe-beton' },
        { label: 'محطات الخرسانة', href: '/catalogue?category=centrale-beton' },
      ],
      brandsTitle: 'العلامات',
      navigationTitle: 'التنقل',
      quickLinks: [
        { label: 'الرئيسية', href: '/' },
        { label: 'الكتالوج', href: '/catalogue' },
        { label: 'المدونة', href: '/blog' },
        { label: 'من نحن', href: '/a-propos' },
        { label: 'اتصل بنا', href: '/contact' },
      ],
      contactTitle: 'الاتصال',
      phone: 'الهاتف',
      email: 'البريد',
      location: 'الموقع',
      locationValue: 'تونس',
      rights: 'جميع الحقوق محفوظة',
      footerTagline: 'قطع غيار لمحطات الخرسانة ومضخات الخرسانة · تونس',
    },
  }[locale];

  return (
    <footer className="w-full border-t border-epct-green/20 bg-epct-dark text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-8 px-5 py-14 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <div className="inline-flex rounded-xl bg-white px-5 py-4">
            <Image
              src="/img/elite_logo_full.png"
              alt="EPCT logo"
              width={520}
              height={136}
              className="h-24 w-auto object-contain"
            />
          </div>
          <p className="mt-3 max-w-xs text-base leading-relaxed text-white/70">{copy.description}</p>
          <a
            href="https://wa.me/21658348436"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded bg-epct-lime px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-epct-ink"
          >
            {copy.whatsapp}
          </a>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">
            {copy.categoriesTitle}
          </p>
          <ul className="space-y-2">
            {copy.categories.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-base text-white/75 transition hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mb-3 mt-6 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">
            {copy.brandsTitle}
          </p>
          <ul className="space-y-1.5">
            {brands.map((b) => (
              <li key={b} className="text-base text-white/75">
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">
            {copy.navigationTitle}
          </p>
          <ul className="space-y-2">
            {copy.quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-base text-white/75 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-display text-xs uppercase tracking-[0.2em] text-epct-lime">
            {copy.contactTitle}
          </p>
          <address className="not-italic space-y-2 text-base text-white/75">
            <p>
              <span className="text-xs uppercase tracking-wider text-white/40">{copy.phone}</span>
              <br />
              <a href="tel:+21658348436" className="transition hover:text-white">
                +216 58 348 436
              </a>
            </p>
            <p>
              <span className="text-xs uppercase tracking-wider text-white/40">{copy.email}</span>
              <br />
              <a href="mailto:epctunisie@gmail.com" className="transition hover:text-white">
                epctunisie@gmail.com
              </a>
            </p>
            <p>
              <span className="text-xs uppercase tracking-wider text-white/40">{copy.location}</span>
              <br />
              {copy.locationValue}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-10">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} EPCT - {copy.rights}
          </p>
          <p className="text-xs text-white/30">{copy.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}
