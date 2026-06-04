'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useSiteLocale } from '@/components/site/LocaleProvider';

const backgrounds = [
  '/img/slider_home_1.png',
  '/img/slider_home_2.png',
  '/img/slider_home_3.png',
  '/img/slider_home_4.png',
];

const brands = [
  { src: '/img/brands/cifa-logo.webp', alt: 'CIFA' },
  { src: '/img/brands/schwing-logo.png', alt: 'Schwing' },
  { src: '/img/brands/zoomlion.png', alt: 'Zoomlion' },
  { src: '/img/brands/putzmeister-logo.png', alt: 'Putzmeister' },
];

export function HeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      title: 'Pieces pour centrales et pompes a beton',
      text: 'Catalogue professionnel de pieces techniques. Disponibilite, reactivite et accompagnement pour vos operations chantier.',
      catalogue: 'Voir le catalogue',
      quote: 'Demander un devis',
      brands: 'Marques disponibles',
      alt: 'Camion pompe beton',
    },
    en: {
      title: 'Parts for batching plants and concrete pumps',
      text: 'Professional catalogue of technical spare parts. Availability, responsiveness and support for your worksite operations.',
      catalogue: 'View catalogue',
      quote: 'Request a quote',
      brands: 'Available brands',
      alt: 'Concrete pump truck',
    },
    ar: {
      title: 'قطع لمحطات الخرسانة ومضخات الخرسانة',
      text: 'كتالوج مهني لقطع الغيار التقنية. توفر وسرعة استجابة ومرافقة لعملياتكم في الورشات.',
      catalogue: 'عرض الكتالوج',
      quote: 'اطلب عرض سعر',
      brands: 'العلامات المتوفرة',
      alt: 'شاحنة مضخة خرسانة',
    },
  }[locale];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % backgrounds.length);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-epct-green px-5 py-12 text-white sm:px-5 sm:py-16 md:px-10 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0f5a39] via-[#1F7A4D] to-[#145e3a]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={backgrounds[activeIndex]}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="pointer-events-none absolute inset-0 hidden lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_72%_56%,rgba(163,230,53,0.2),transparent)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,82,52,0.86)_18%,rgba(25,106,68,0.45)_56%,rgba(14,73,46,0.82)_100%)]" />
          <div className="absolute -right-2 bottom-0 top-0 w-[72%] opacity-85 md:w-[66%]">
            <Image
              src={backgrounds[activeIndex]}
              alt={copy.alt}
              width={1600}
              height={900}
              sizes="58vw"
              className="h-full w-full object-contain object-right-bottom"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-6 lg:grid lg:grid-cols-[1fr_1fr] lg:items-end lg:gap-10">
        <div className="relative mx-auto aspect-[16/10] w-full max-w-md lg:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={backgrounds[activeIndex]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={backgrounds[activeIndex]}
                alt={copy.alt}
                width={1600}
                height={900}
                sizes="(max-width: 768px) 100vw, 400px"
                className="h-full w-full object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/25 p-5 backdrop-blur-sm sm:p-6 md:p-8 lg:ml-[-3rem] lg:max-w-xl xl:ml-[-4.5rem]">
          <h1 className="max-w-3xl font-display text-[1.6rem] font-black uppercase leading-tight tracking-tight sm:text-[2.2rem] md:text-display-lg">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base md:text-lg">
            {copy.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="rounded bg-epct-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink transition hover:bg-lime-300"
            >
              {copy.catalogue}
            </Link>
            <Link
              href="/contact"
              className="rounded border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
            >
              {copy.quote}
            </Link>
          </div>

          <div className="mt-8 border-t border-white/15 pt-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">{copy.brands}</p>
            <div className="mt-4 rounded-xl border border-white/20 bg-white p-4 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.55)]">
              <div className="grid grid-cols-4 gap-x-3 sm:gap-x-5">
                {brands.map((brand) => (
                  <div key={brand.alt} className="h-7 w-16 sm:h-9 sm:w-24 md:h-10 md:w-28">
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={240}
                      height={120}
                      sizes="120px"
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 lg:hidden">
          {backgrounds.map((bg, idx) => (
            <button
              key={bg}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-6 bg-epct-lime' : 'w-2 bg-white/35'
              }`}
            />
          ))}
        </div>

        <div className="hidden items-end justify-end lg:flex">
          <div className="flex gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-2 backdrop-blur">
            {backgrounds.map((bg, idx) => (
              <button
                key={bg}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? 'w-8 bg-epct-lime' : 'w-2 bg-white/35'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
