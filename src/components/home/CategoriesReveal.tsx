'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useSiteLocale } from '@/components/site/LocaleProvider';

const segmentImages = ['/img/segment_1.png', '/img/segment_2.jpg', '/img/segment_3.jpg'];

export function CategoriesReveal() {
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      eyebrow: 'Catalogue EPCT',
      title: 'Nos segments',
      intro:
        "EPCT organise son offre par famille d'equipements pour aider vos equipes a identifier plus vite les bonnes pieces, les bonnes references et les bonnes compatibilites.",
      statsLabel: 'References disponibles',
      cta: 'Consulter',
      segments: [
        {
          number: '01',
          label: 'Toupies & Malaxeurs',
          href: '/catalogue?category=toupie',
          desc: 'Couronnes, galets, reducteurs, joints et pieces de rotation pour toupies et malaxeurs beton.',
          parts: ['Couronnes', 'Galets porteurs', 'Reducteurs', "Joints d'etancheite"],
          stat: '500+',
        },
        {
          number: '02',
          label: 'Pompes a beton',
          href: '/catalogue?category=pompe-beton',
          desc: "Pistons, plaques d'usure, spheres de clapet, tubes en S et composants hydrauliques de pompage.",
          parts: ['Pistons', 'Spheres', 'Tubes en S', "Plaques d'usure"],
          stat: '300+',
        },
        {
          number: '03',
          label: 'Centrales a beton',
          href: '/catalogue?category=centrale-beton',
          desc: 'Doseurs, vis sans fin, capteurs, tapis et actionneurs pour equipements de centrale a beton.',
          parts: ['Vis sans fin', 'Tapis doseurs', 'Capteurs', 'Actionneurs'],
          stat: '200+',
        },
      ],
    },
    en: {
      eyebrow: 'EPCT catalogue',
      title: 'Our segments',
      intro:
        'EPCT structures its offer by equipment family so your teams can identify the right parts, references and compatibilities more quickly.',
      statsLabel: 'Available references',
      cta: 'Browse',
      segments: [
        {
          number: '01',
          label: 'Mixers',
          href: '/catalogue?category=toupie',
          desc: 'Ring gears, rollers, reducers, seals and rotation parts for concrete mixers and drums.',
          parts: ['Ring gears', 'Support rollers', 'Reducers', 'Seals'],
          stat: '500+',
        },
        {
          number: '02',
          label: 'Concrete pumps',
          href: '/catalogue?category=pompe-beton',
          desc: 'Pistons, wear plates, valve balls, S tubes and hydraulic pumping components.',
          parts: ['Pistons', 'Valve balls', 'S tubes', 'Wear plates'],
          stat: '300+',
        },
        {
          number: '03',
          label: 'Batching plants',
          href: '/catalogue?category=centrale-beton',
          desc: 'Feeders, screw conveyors, load cells, belts and actuators for batching plant equipment.',
          parts: ['Screw conveyors', 'Belts', 'Load cells', 'Actuators'],
          stat: '200+',
        },
      ],
    },
    ar: {
      eyebrow: 'كتالوج EPCT',
      title: 'فئاتنا',
      intro:
        'تنظم EPCT عرضها حسب عائلات المعدات حتى تتمكن فرقكم من الوصول بسرعة الى القطع والمراجع والتوافقات المناسبة.',
      statsLabel: 'مراجع متوفرة',
      cta: 'تصفح',
      segments: [
        {
          number: '01',
          label: 'الخلاطات',
          href: '/catalogue?category=toupie',
          desc: 'تيجان مسننة وبكرات ومخفضات وحشوات وقطع دوران للخلاطات ومعدات المزج.',
          parts: ['تيجان', 'بكرات', 'مخفضات', 'حشوات'],
          stat: '500+',
        },
        {
          number: '02',
          label: 'مضخات الخرسانة',
          href: '/catalogue?category=pompe-beton',
          desc: 'مكابس وصفائح تآكل وكرات صمامات وانابيب S ومكونات هيدروليكية للضخ.',
          parts: ['مكابس', 'كرات صمامات', 'انابيب S', 'صفائح تآكل'],
          stat: '300+',
        },
        {
          number: '03',
          label: 'محطات الخرسانة',
          href: '/catalogue?category=centrale-beton',
          desc: 'مغذيات ولولب نقل وخلايا وزن وسيور ومشغلات لمعدات محطات الخرسانة.',
          parts: ['لولب نقل', 'سيور', 'خلايا وزن', 'مشغلات'],
          stat: '200+',
        },
      ],
    },
  }[locale];

  return (
    <section className="w-full bg-[#0a2015] px-5 py-16 text-white md:px-10 md:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.32em] text-epct-lime sm:text-sm">
            {copy.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl">
            {copy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/72 sm:text-base md:text-lg">
            {copy.intro}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:gap-7">
          {copy.segments.map((segment, index) => (
            <article
              key={segment.number}
              className="overflow-hidden border border-white/10 bg-white/95 text-epct-dark shadow-[0_30px_60px_-36px_rgba(0,0,0,0.65)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#edf2ec]">
                <Image
                  src={segmentImages[index]}
                  alt={segment.label}
                  width={1600}
                  height={1000}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="h-full w-full object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07180f]/72 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 inline-flex min-h-10 items-center bg-epct-green px-3 text-sm font-bold tracking-[0.14em] text-white">
                  {segment.number}
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">{copy.statsLabel}</p>
                    <p className="mt-1 font-display text-3xl font-black text-white">{segment.stat}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 px-5 py-5 sm:px-6 sm:py-6">
                <div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-epct-dark sm:text-3xl">
                    {segment.label}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-epct-ink/74 sm:text-[15px]">
                    {segment.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {segment.parts.map((part) => (
                    <span
                      key={part}
                      className="inline-flex min-h-8 items-center bg-[#f3f6f1] px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-epct-ink/76"
                    >
                      {part}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-epct-ink/10 pt-4">
                  <Link
                    href={segment.href}
                    className="inline-flex min-h-11 items-center gap-2 bg-epct-lime px-4 text-sm font-semibold uppercase tracking-[0.08em] text-epct-ink transition hover:brightness-95"
                  >
                    {copy.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
