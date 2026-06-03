'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const LIME = '#A3E635';

const categories = [
  {
    number: '01',
    label: 'Toupies & Malaxeurs',
    href: '/catalogue?category=toupie',
    desc: 'Pieces de transmission, tambour, couronne dentee et reducteurs pour toutes marques de toupies beton.',
    parts: ['Couronnes', 'Galets porteurs', 'Reducteurs', "Joints d'etancheite"],
  },
  {
    number: '02',
    label: 'Pompes a beton',
    href: '/catalogue?category=pompe-beton',
    desc: "Pistons, spheres de clapet, plaques d'usure, tubes en S et joints hydrauliques pour pompes sur camion.",
    parts: ['Pistons hydrauliques', 'Spheres de clapet', 'Tubes en S', "Plaques d'usure"],
  },
  {
    number: '03',
    label: 'Centrales a beton',
    href: '/catalogue?category=centrale-beton',
    desc: 'Doseurs, tapis doseurs, vis sans fin, capteurs de pesage et actionneurs pour centrales a beton.',
    parts: ['Vis sans fin', 'Tapis doseurs', 'Capteurs de pesage', 'Actionneurs'],
  },
];

const rightPanels = [
  {
    image: '/img/segment_1.png',
    stat: { value: '500+', label: 'References toupies' },
  },
  {
    image: '/img/segment_2.jpg',
    stat: { value: '300+', label: 'References pompes' },
  },
  {
    image: '/img/segment_3.jpg',
    stat: { value: '200+', label: 'References centrales' },
  },
];

export function CategoriesReveal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    panelRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveIndex(i);
      }, { threshold: 0.5 });

      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="w-full bg-epct-dark py-0">
      <div className="px-4 pt-12 text-center sm:px-6 md:px-14 md:pt-16">
        <p className="font-display text-xs uppercase tracking-[0.45em] sm:text-sm" style={{ color: LIME }}>
          Catalogue EPCT
        </p>
        <h2 className="mt-2 font-display text-3xl font-black uppercase text-white sm:mt-3 sm:text-5xl md:text-6xl">
          Nos segments
        </h2>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 md:px-8">
        <div className="min-w-0">
          {categories.map((cat, i) => (
            <div
              key={cat.number}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="flex min-h-[70vh] items-center py-8 sm:h-screen sm:py-0"
            >
              <div className="relative h-[65vh] min-h-[480px] w-full overflow-hidden rounded-2xl border border-white/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)] sm:h-[80vh] sm:min-h-[620px] sm:rounded-[2.2rem]">
                <Image
                  src={rightPanels[i].image}
                  alt={`Segment ${cat.number}`}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 92vw"
                  className="h-full w-full object-cover"
                  priority={i === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#04170d]/90 via-[#052114]/62 to-[#04170d]/44" />

                <div className="relative z-10 flex h-full items-end p-4 sm:p-5 md:p-8">
                  <div
                    className="w-full max-w-3xl rounded-xl border border-[#87c728]/45 px-4 py-4 sm:rounded-[1.6rem] sm:px-6 sm:py-6 md:px-8 md:py-8"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31,122,77,0.96), rgba(24,94,58,0.96))',
                      boxShadow: '0 20px 55px -30px rgba(0,0,0,0.8)',
                      opacity: i === activeIndex ? 1 : 0.42,
                    }}
                  >
                    <p className="font-display text-[3rem] font-black leading-none tracking-tighter text-[#d6fb7f] sm:text-[4.8rem] md:text-[6.2rem]">
                      {cat.number}
                    </p>

                    <span className="mt-2 inline-block rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-sm uppercase tracking-[0.24em] text-white/90">
                      Segment {cat.number}
                    </span>

                    <h3 className="mt-3 font-display text-2xl font-black uppercase leading-tight text-white sm:mt-4 sm:text-4xl md:text-5xl">
                      {cat.label}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-lg md:text-xl">
                      {cat.desc}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-2.5">
                      {cat.parts.map((part) => (
                        <span
                          key={part}
                          className="rounded border border-white/30 bg-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-white/95 sm:px-3 sm:py-1.5 sm:text-xs"
                        >
                          {part}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-4">
                      <p className="font-display text-3xl font-black text-[#d6fb7f] sm:text-4xl md:text-5xl">
                        {rightPanels[i].stat.value}
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.23em] text-white/85 sm:text-xs md:text-sm">
                        {rightPanels[i].stat.label}
                      </p>
                    </div>

                    <Link
                      href={cat.href}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#d6fb7f] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-epct-ink sm:mt-6 sm:px-6 sm:py-3 sm:text-sm"
                    >
                      Voir les pieces →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
