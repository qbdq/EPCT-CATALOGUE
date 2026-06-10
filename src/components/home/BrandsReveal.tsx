'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteLocale } from '@/components/site/LocaleProvider';

const brands = [
  {
    name: 'Putzmeister',
    href: '/catalogue?brand=putzmeister',
    image: '/img/putz-pump-truck.png',
  },
  {
    name: 'Schwing',
    href: '/catalogue?brand=schwing',
    image: '/img/schwing-pump-truck.png',
  },
  {
    name: 'CIFA',
    href: '/catalogue?brand=cifa',
    image: '/img/cifa-pump-truck.png',
  },
  {
    name: 'Zoomlion',
    href: '/catalogue?brand=zoomlion',
    image: '/img/zoomlion-pump-truck.png',
  },
];

export function BrandsReveal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      eyebrow: 'Marques partenaires',
      title: 'Nos marques',
      origin: ['Allemagne', 'Allemagne', 'Italie', 'Chine'],
      specialty: [
        "Pompes a beton & malaxeurs haute pression. Pieces d'usure, pistons et joints disponibles pour toutes generations de pompes.",
        'Fleches de pompage & systemes de distribution beton. Stock de pieces hydrauliques et mecaniques pour Schwing S- et KVM-series.',
        "Centrales a beton & pompes compactes sur camion. Pieces d'origine et compatibles pour gammes K et PC.",
        'Equipements de levage, pompage et melange beton. Pieces pour pompes sur camion et centrales a beton Zoomlion.',
      ],
      cta: 'Voir les pieces →',
    },
    en: {
      eyebrow: 'Partner brands',
      title: 'Our brands',
      origin: ['Germany', 'Germany', 'Italy', 'China'],
      specialty: [
        'Concrete pumps and high-pressure mixers. Wear parts, pistons and seals available for all pump generations.',
        'Pumping booms and concrete distribution systems. Hydraulic and mechanical spare parts for Schwing S and KVM series.',
        'Batching plants and compact truck pumps. Genuine and compatible parts for K and PC ranges.',
        'Lifting, pumping and concrete mixing equipment. Parts for Zoomlion truck pumps and batching plants.',
      ],
      cta: 'View parts →',
    },
    ar: {
      eyebrow: 'العلامات الشريكة',
      title: 'علاماتنا',
      origin: ['المانيا', 'المانيا', 'ايطاليا', 'الصين'],
      specialty: [
        'مضخات خرسانة وخلاطات عالية الضغط. قطع تآكل ومكابس وحشوات متوفرة لمختلف اجيال المضخات.',
        'اذرع ضخ وانظمة توزيع الخرسانة. مخزون من القطع الهيدروليكية والميكانيكية لسلاسل Schwing.',
        'محطات خرسانة ومضخات مدمجة على الشاحنات. قطع اصلية ومتوافقة لسلاسل K و PC.',
        'معدات رفع وضخ وخلط الخرسانة. قطع لمضخات الشاحنات ومحطات الخرسانة من Zoomlion.',
      ],
      cta: 'عرض القطع ←',
    },
  }[locale];

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
    <section className="w-full bg-white py-0">
      <div className="px-6 pt-20 text-center md:px-14">
        <p className="font-display text-sm uppercase tracking-[0.45em]" style={{ color: '#1F7A4D' }}>
          {copy.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">
          {copy.title}
        </h2>
      </div>

      <div className="grid w-full grid-cols-1 lg:grid-cols-[5fr_7fr]">
        <div className="lg:pl-8 xl:pl-16">
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className="flex min-h-[60vh] items-center py-12 lg:h-[calc(100vh-5.7rem)] lg:py-0"
            >
              <div className="w-full max-w-xl pr-0 text-center lg:pr-4 lg:text-left">
                <div className="mb-6 flex justify-center lg:hidden">
                  <div className="aspect-[4/3] w-full max-w-[320px] overflow-hidden rounded-2xl border border-epct-green/15 bg-gradient-to-br from-white to-epct-bg/40 shadow-lg">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={1280}
                      height={960}
                      sizes="320px"
                      className="h-full w-full object-contain p-4"
                      priority={i === 0}
                    />
                  </div>
                </div>

                <p
                  className="font-display text-[3.5rem] font-black leading-none tracking-tighter sm:text-[5rem] md:text-[6.5rem]"
                  style={{ color: '#1F7A4D', opacity: i === activeIndex ? 1 : 0.18 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>

                <span
                  className="mt-3 inline-block rounded-full border px-4 py-1.5 text-sm uppercase tracking-[0.26em] transition-colors duration-300"
                  style={{
                    borderColor: i === activeIndex ? 'rgba(31,122,77,0.4)' : 'rgba(0,0,0,0.12)',
                    color: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.3)',
                  }}
                >
                  {copy.origin[i]}
                </span>

                <h3
                  className="mt-4 font-display text-4xl font-black uppercase leading-none tracking-tight transition-colors duration-300 sm:text-6xl md:text-8xl"
                  style={{ color: i === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.15)' }}
                >
                  {brand.name}
                </h3>

                <p
                  className="mt-5 text-base leading-relaxed transition-colors duration-300 sm:text-lg md:text-xl"
                  style={{ color: i === activeIndex ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.2)' }}
                >
                  {copy.specialty[i]}
                </p>

                <div className="mt-7 flex justify-center lg:justify-start">
                  <Link
                    href={brand.href}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink transition-opacity duration-300"
                    style={{
                      backgroundColor: '#A3E635',
                      opacity: i === activeIndex ? 1 : 0,
                      pointerEvents: i === activeIndex ? 'auto' : 'none',
                    }}
                  >
                    {copy.cta}
                  </Link>
                </div>

                <div className="mt-6 flex justify-center gap-2 lg:hidden">
                  {brands.map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className="block rounded-full transition-all duration-300"
                      style={{
                        width: dotIndex === activeIndex ? '1.25rem' : '0.4rem',
                        height: '0.25rem',
                        background: dotIndex === activeIndex ? '#1F7A4D' : 'rgba(0,0,0,0.2)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-[5.7rem] flex h-[calc(100vh-5.7rem)] items-center justify-center py-6 pr-8 xl:pr-14">
            <div className="relative h-[600px] w-full overflow-hidden rounded-[2.25rem] border border-epct-green/15 bg-gradient-to-br from-white to-epct-bg/40 shadow-[0_30px_65px_-28px_rgba(31,122,77,0.48)]">
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
                    width={1600}
                    height={1200}
                    sizes="62vw"
                    className="h-full w-full object-contain object-center drop-shadow-[0_38px_50px_rgba(15,33,22,0.26)]"
                    priority={activeIndex === 0}
                  />
                </motion.div>
              </AnimatePresence>

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
