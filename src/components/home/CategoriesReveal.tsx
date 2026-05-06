'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const LIME = '#A3E635';

const categories = [
  {
    number: '01',
    label: 'Toupies & Malaxeurs',
    href: '/catalogue?category=toupie',
    desc: 'Pièces de transmission, tambour, couronne dentée et réducteurs pour toutes marques de toupies béton.',
    parts: ['Couronnes', 'Galets porteurs', 'Réducteurs', "Joints d'étanchéité"],
  },
  {
    number: '02',
    label: 'Pompes à béton',
    href: '/catalogue?category=pompe-beton',
    desc: "Pistons, sphères de clapet, plaques d'usure, tubes en S et joints hydrauliques pour pompes sur camion.",
    parts: ['Pistons hydrauliques', 'Sphères de clapet', 'Tubes en S', "Plaques d'usure"],
  },
  {
    number: '03',
    label: 'Centrales à béton',
    href: '/catalogue?category=centrale-beton',
    desc: 'Doseurs, tapis doseurs, vis sans fin, capteurs de pesage et actionneurs pour centrales à béton.',
    parts: ['Vis sans fin', 'Tapis doseurs', 'Capteurs de pesage', 'Actionneurs'],
  },
];

const rightPanels = [
  {
    bg: 'from-[#0a1a0f] to-[#071209]',
    stat: { value: '500+', label: 'Références toupies' },
  },
  {
    bg: 'from-[#0d1a10] to-[#060e09]',
    stat: { value: '300+', label: 'Références pompes' },
  },
  {
    bg: 'from-[#0a1408] to-[#050c06]',
    stat: { value: '200+', label: 'Références centrales' },
  },
];

export function CategoriesReveal() {
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

  const active = categories[activeIndex];
  const panel = rightPanels[activeIndex];

  return (
    <section className="w-full bg-epct-dark py-0">
      {/* Section header */}
      <div className="px-6 pt-16 text-center md:px-14">
        <p className="font-display text-xs uppercase tracking-[0.5em]" style={{ color: LIME }}>
          Catalogue EPCT
        </p>
        <h2 className="mt-2 font-display text-4xl uppercase text-white md:text-5xl">
          Nos segments
        </h2>
      </div>

      {/* Two-column: left scrolls, right sticky */}
      <div className="mx-auto flex max-w-6xl gap-10 px-6 md:px-14 lg:gap-16">

        {/* LEFT — one 100vh panel per category */}
        <div className="flex-1 min-w-0">
          {categories.map((cat, i) => (
            <div
              key={cat.number}
              ref={(el) => { panelRefs.current[i] = el; }}
              className="flex h-screen items-center"
            >
              <div className="max-w-md">
                {/* Number */}
                <p
                  className="font-display text-[4.5rem] font-black leading-none tracking-tighter transition-all duration-300 md:text-[6rem]"
                  style={{ color: LIME, opacity: i === activeIndex ? 1 : 0.12 }}
                >
                  {cat.number}
                </p>

                {/* Segment label */}
                <span
                  className="mt-3 inline-block rounded-full border px-4 py-1 text-xs uppercase tracking-[0.3em] transition-colors duration-300"
                  style={{
                    borderColor: i === activeIndex ? 'rgba(163,230,53,0.4)' : 'rgba(255,255,255,0.1)',
                    color: i === activeIndex ? LIME : 'rgba(255,255,255,0.3)',
                  }}
                >
                  Segment {cat.number}
                </span>

                {/* Title */}
                <h3
                  className="mt-3 font-display text-4xl font-black uppercase leading-tight transition-colors duration-300 md:text-5xl"
                  style={{ color: i === activeIndex ? '#ffffff' : 'rgba(255,255,255,0.18)' }}
                >
                  {cat.label}
                </h3>

                {/* Description */}
                <p
                  className="mt-4 text-base leading-relaxed transition-colors duration-300"
                  style={{ color: i === activeIndex ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)' }}
                >
                  {cat.desc}
                </p>

                {/* Parts chips */}
                <div
                  className="mt-5 flex flex-wrap gap-2 transition-opacity duration-300"
                  style={{ opacity: i === activeIndex ? 1 : 0 }}
                >
                  {cat.parts.map((part) => (
                    <span
                      key={part}
                      className="rounded border border-white/15 px-3 py-1 text-xs uppercase tracking-wider text-white/60"
                    >
                      {part}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={cat.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-epct-ink transition-opacity duration-300"
                  style={{
                    backgroundColor: LIME,
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

        {/* RIGHT — sticky panel */}
        <div className="hidden w-[42%] shrink-0 lg:block">
          <div className="sticky top-0 flex h-screen items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className={`flex h-[460px] w-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${panel.bg} p-10`}
              >
                {/* Giant number watermark */}
                <p
                  className="select-none font-display text-[10rem] font-black leading-none tracking-tighter"
                  style={{ color: LIME, opacity: 0.08 }}
                  aria-hidden
                >
                  {active.number}
                </p>

                {/* Stat */}
                <div className="-mt-8 text-center">
                  <p className="font-display text-6xl font-black" style={{ color: LIME }}>
                    {panel.stat.value}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/50">
                    {panel.stat.label}
                  </p>
                </div>

                {/* Dots */}
                <div className="mt-10 flex gap-2">
                  {categories.map((_, i) => (
                    <span
                      key={i}
                      className="block rounded-full transition-all duration-300"
                      style={{
                        width: i === activeIndex ? '1.75rem' : '0.4rem',
                        height: '0.3rem',
                        background: i === activeIndex ? LIME : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
