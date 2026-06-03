'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    src: '/img/cifa-pump-truck.png',
    alt: 'Pompe a beton CIFA',
    label: 'CIFA - Pompe a beton',
    desc: 'Materiel haute performance pour chantiers exigeants.',
  },
  {
    src: '/img/zoomlion-pump-truck.png',
    alt: 'Camion pompe Zoomlion',
    label: 'Zoomlion - Pompe a beton',
    desc: 'Transport et pompage du beton en continu sur site.',
  },
  {
    src: '/img/schwing-pump-truck.png',
    alt: 'Pompe a beton Schwing',
    label: 'Schwing - Pompe a beton',
    desc: 'Pompe a beton de precision pour grandes hauteurs.',
  },
];

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0, scale: 0.95 }),
};

export function TruckSlider() {
  const [[index, dir], setSlide] = useState([0, 0]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (newDir: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSlide(([prev]) => [(prev + newDir + slides.length) % slides.length, newDir]);
  };

  const slide = slides[index];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative flex h-[520px] w-full items-center justify-center bg-gradient-to-b from-epct-dark to-[#071a11] md:h-[620px]">
        <div className="pointer-events-none absolute left-0 right-0 top-8 z-10 text-center">
          <p className="font-display text-2xl uppercase tracking-[0.5em] text-white/20 md:text-3xl lg:text-4xl">
            EPCT Tunisie
          </p>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(31,122,77,0.25),transparent)]" />

        <AnimatePresence custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            <div className="mx-auto h-[300px] w-full max-w-2xl drop-shadow-2xl md:h-[380px]">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1600}
                height={900}
                sizes="(max-width: 768px) 95vw, 800px"
                className="h-full w-full object-contain"
                priority
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-6 text-center"
            >
              <p className="font-display text-sm uppercase tracking-[0.35em] text-epct-lime md:text-base">
                {slide.label}
              </p>
              <p className="mt-1.5 text-sm text-white/60">{slide.desc}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={() => go(-1)}
          aria-label="Precedent"
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-epct-green/60"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Suivant"
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition hover:bg-epct-green/60"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex justify-center gap-2 bg-epct-dark py-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide([i, i > index ? 1 : -1])}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-epct-lime' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
