'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const brands = [
  {
    name: 'Putzmeister',
    origin: 'Allemagne',
    specialty: 'Pompes à béton & malaxeurs haute pression. Pièces d\'usure, pistons et joints disponibles pour toutes générations de pompes.',
    href: '/catalogue?brand=putzmeister',
    image: '/img/putz-pump-truck.png',
  },
  {
    name: 'Schwing',
    origin: 'Allemagne',
    specialty: 'Flèches de pompage & systèmes de distribution béton. Stock de pièces hydrauliques et mécaniques pour Schwing S- et KVM-series.',
    href: '/catalogue?brand=schwing',
    image: '/img/schwing-pump-truck.png',
  },
  {
    name: 'CIFA',
    origin: 'Italie',
    specialty: 'Centrales à béton & pompes compactes sur camion. Pièces d\'origine et compatibles pour gammes K et PC.',
    href: '/catalogue?brand=cifa',
    image: '/img/cifa-pump-truck.png',
  },
  {
    name: 'Zoomlion',
    origin: 'Chine',
    specialty: 'Équipements de levage, pompage et mélange béton. Pièces pour pompes sur camion et centrales à béton Zoomlion.',
    href: '/catalogue?brand=zoomlion',
    image: '/img/zoomlion-pump-truck.png',
  },
];

export function BrandsReveal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.5 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="w-full bg-white py-0">
      {/* Section header */}
      <div className="px-6 pt-20 text-center md:px-14">
        <p className="font-display text-sm uppercase tracking-[0.45em]" style={{ color: '#1F7A4D' }}>
          Marques partenaires
        </p>
        <h2 className="mt-3 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">
          Nos marques
        </h2>
      </div>

      {/* Two-column layout: symmetric grid */}
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 px-6 md:px-12 lg:grid-cols-[2fr_3fr]">

        {/* LEFT — one panel per brand */}
        <div>
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="flex min-h-[60vh] items-center py-12 lg:h-[calc(100vh-5.7rem)] lg:py-0"
            >
              <div className="max-w-lg px-1">
                {/* Mobile image (shown only on small screens) */}
                <div className="mb-6 block lg:hidden">
                  <div className="relative aspect-[4/3] w-full max-w-[320px] overflow-hidden rounded-2xl border border-epct-green/15 bg-gradient-to-br from-white to-epct-bg/40 shadow-lg">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      sizes="320px"
                      className="object-contain p-4"
                      priority={i === 0}
                    />
                  </div>
                </div>

                {/* Index number */}
                <p
                  className="font-display text-[3.5rem] font-black leading-none tracking-tighter sm:text-[5rem] md:text-[6.5rem]"
                  style={{ color: '#1F7A4D', opacity: i === activeIndex ? 1 : 0.18 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Origin pill */}
                <span
                  className="mt-3 inline-block rounded-full border px-4 py-1.5 text-sm uppercase tracking-[0.26em] transition-colors duration-300"
                  style={{
                    borderColor: i === activeIndex ? 'rgba(31,122,77,0.4)' : 'rgba(0,0,0,0.12)',
                    color: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.3)',
                  }}
                >
                  {brand.origin}
                </span>

                {/* Brand name */}
                <h3
                  className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-tight transition-colors duration-300 sm:text-6xl md:text-8xl"
                  style={{ color: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.15)' }}
                >
                  {brand.name}
                </h3>

                {/* Description */}
                <p
                  className="mt-5 text-base leading-relaxed transition-colors duration-300 sm:text-lg md:text-xl"
                  style={{ color: i === activeIndex ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.2)' }}
                >
                  {brand.specialty}
                </p>

                {/* CTA */}
                <Link
                  href={brand.href}
                  className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink transition-opacity duration-300"
                  style={{
                    backgroundColor: '#A3E635',
                    opacity: i === activeIndex ? 1 : 0,
                    pointerEvents: i === activeIndex ? 'auto' : 'none',
                  }}
                >
                  Voir les pièces →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky dots indicator (mobile only) */}
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg backdrop-blur lg:hidden">
          {brands.map((_, i) => (
            <span
              key={i}
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '1.25rem' : '0.4rem',
                height: '0.25rem',
                background: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.2)',
              }}
            />
          ))}
        </div>

        {/* RIGHT — sticky image panel */}
        <div className="hidden lg:block">
          <div className="sticky top-[5.7rem] flex h-[calc(100vh-5.7rem)] items-center justify-center py-8">
            <div className="relative h-[620px] w-full overflow-hidden rounded-[2.25rem] border border-epct-green/15 bg-gradient-to-br from-white to-epct-bg/40 shadow-[0_30px_65px_-28px_rgba(31,122,77,0.48)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={brands[activeIndex].image}
                    alt={brands[activeIndex].name}
                    fill
                    sizes="62vw"
                    className="object-contain object-center drop-shadow-[0_38px_50px_rgba(15,33,22,0.26)]"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Active dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {brands.map((_, i) => (
                  <span
                    key={i}
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === activeIndex ? '1.75rem' : '0.4rem',
                      height: '0.3rem',
                      background: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.15)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
