'use client';

import Link from 'next/link';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { CategoriesReveal } from '@/components/home/CategoriesReveal';
import { BrandsReveal } from '@/components/home/BrandsReveal';
import { HeroShowcase } from '@/components/home/HeroShowcase';
import { SuppliersSlider } from '@/components/home/SuppliersSlider';
import { useSiteLocale } from '@/components/site/LocaleProvider';

export function HomePageClient() {
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      features: [
        {
          icon: '⚡',
          title: 'Livraison rapide en Tunisie',
          desc: 'Livraison rapide en Tunisie dans 24h sur les references prioritaires et urgences chantier.',
        },
        {
          icon: '🤝',
          title: 'Partenaire officiel multi-marques',
          desc: 'Partenaire officiel pour les marques les plus populaires: Schwing, CIFA, Putzmeister et Zoomlion.',
        },
        {
          icon: '🛠',
          title: 'Expertise terrain & reparation',
          desc: "Expertise en main d'oeuvre et reparation des pompes, toupies et centrales a beton.",
        },
      ],
      approachEyebrow: 'Notre approche',
      approachTitle: 'Pourquoi EPCT ?',
      approachText:
        'Une methode claire: disponibilite des references essentielles, accompagnement technique rapide et suivi terrain oriente resultat.',
      activityEyebrow: 'Notre activite',
      activityTitle: 'Solutions autour du beton',
      activityText:
        "EPCT accompagne les entreprises de travaux publics et BTP dans la maintenance et l'approvisionnement de leurs systemes de transport et de pompage beton. Une expertise locale, un catalogue cible, une reponse rapide.",
      activityPoints: [
        'Livraison rapide en Tunisie dans 24h.',
        'Partenaire officiel pour Schwing, CIFA, Putzmeister, Zoomlion.',
        "Expertise en main d'oeuvre et reparation pompes, toupies, centrales.",
      ],
      learnMore: 'En savoir plus',
      stats: [
        { val: '5+', label: 'Marques referencees' },
        { val: '3', label: 'Segments produits' },
        { val: '100%', label: 'Marche tunisien' },
        { val: '24h', label: 'Delai de reponse cible' },
      ],
      directContact: 'Contact direct',
      urgentTitle: 'Un besoin urgent de piece ?',
      urgentText:
        'Transmettez votre reference, photo ou besoin technique. Notre equipe vous repond rapidement avec une proposition adaptee.',
      contactForm: 'Formulaire contact',
      whatsapp: 'WhatsApp',
    },
    en: {
      features: [
        {
          icon: '⚡',
          title: 'Fast delivery in Tunisia',
          desc: 'Fast delivery in Tunisia within 24 hours for priority references and urgent jobsite needs.',
        },
        {
          icon: '🤝',
          title: 'Official multi-brand partner',
          desc: 'Official partner for the most popular brands: Schwing, CIFA, Putzmeister and Zoomlion.',
        },
        {
          icon: '🛠',
          title: 'Field expertise & repair',
          desc: 'Hands-on expertise for pumps, mixers and batching plant repair and support.',
        },
      ],
      approachEyebrow: 'Our approach',
      approachTitle: 'Why EPCT?',
      approachText:
        'A clear method: availability of essential references, fast technical support and field follow-up focused on results.',
      activityEyebrow: 'Our business',
      activityTitle: 'Concrete equipment solutions',
      activityText:
        'EPCT supports public works and construction companies with maintenance and spare-part supply for concrete transport and pumping systems. Local expertise, a focused catalogue and fast response.',
      activityPoints: [
        'Fast delivery in Tunisia within 24 hours.',
        'Official partner for Schwing, CIFA, Putzmeister, Zoomlion.',
        'Hands-on expertise for pumps, mixers and batching plants.',
      ],
      learnMore: 'Learn more',
      stats: [
        { val: '5+', label: 'Referenced brands' },
        { val: '3', label: 'Product segments' },
        { val: '100%', label: 'Tunisian market' },
        { val: '24h', label: 'Target response time' },
      ],
      directContact: 'Direct contact',
      urgentTitle: 'Need an urgent part?',
      urgentText:
        'Send us your reference, photo or technical need. Our team will reply quickly with a suitable proposal.',
      contactForm: 'Contact form',
      whatsapp: 'WhatsApp',
    },
    ar: {
      features: [
        {
          icon: '⚡',
          title: 'تسليم سريع في تونس',
          desc: 'تسليم سريع في تونس خلال 24 ساعة للمراجع ذات الاولوية وحالات الورشات المستعجلة.',
        },
        {
          icon: '🤝',
          title: 'شريك رسمي متعدد العلامات',
          desc: 'شريك رسمي لاشهر العلامات مثل Schwing و CIFA و Putzmeister و Zoomlion.',
        },
        {
          icon: '🛠',
          title: 'خبرة ميدانية واصلاح',
          desc: 'خبرة عملية في صيانة واصلاح المضخات والخلاطات ومحطات الخرسانة.',
        },
      ],
      approachEyebrow: 'منهجنا',
      approachTitle: 'لماذا EPCT؟',
      approachText:
        'منهج واضح: توفر المراجع الاساسية، مواكبة تقنية سريعة ومتابعة ميدانية موجهة نحو النتيجة.',
      activityEyebrow: 'نشاطنا',
      activityTitle: 'حلول حول معدات الخرسانة',
      activityText:
        'ترافق EPCT شركات الاشغال العامة والبناء في صيانة وتزويد انظمة نقل وضخ الخرسانة. خبرة محلية وكتالوج مركز واستجابة سريعة.',
      activityPoints: [
        'تسليم سريع في تونس خلال 24 ساعة.',
        'شريك رسمي لعلامات Schwing و CIFA و Putzmeister و Zoomlion.',
        'خبرة عملية في صيانة المضخات والخلاطات ومحطات الخرسانة.',
      ],
      learnMore: 'اعرف المزيد',
      stats: [
        { val: '5+', label: 'علامات مرجعية' },
        { val: '3', label: 'فئات المنتجات' },
        { val: '100%', label: 'السوق التونسي' },
        { val: '24h', label: 'هدف زمن الاستجابة' },
      ],
      directContact: 'اتصال مباشر',
      urgentTitle: 'هل تحتاج الى قطعة بشكل عاجل؟',
      urgentText:
        'ارسل المرجع او الصورة او الحاجة التقنية، وسيعود اليك فريقنا بسرعة باقتراح مناسب.',
      contactForm: 'استمارة الاتصال',
      whatsapp: 'واتساب',
    },
  }[locale];

  return (
    <main className="w-full">
      <HeroShowcase />
      <BrandsReveal />

      <section className="w-full bg-white px-5 py-20 md:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <ScrollReveal>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-epct-green">{copy.approachEyebrow}</p>
            <h2 className="mt-2 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">
              {copy.approachTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-epct-ink/75 md:text-xl">
              {copy.approachText}
            </p>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {copy.features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <article className="group relative h-full overflow-hidden rounded-xl border border-epct-green/15 bg-gradient-to-b from-white to-epct-bg/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-epct-green/35 hover:shadow-[0_16px_32px_-20px_rgba(31,122,77,0.5)]">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-epct-green/20 via-epct-lime/70 to-epct-green/20" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg border border-epct-green/20 bg-white text-3xl">
                      {f.icon}
                    </span>
                    <span className="font-display text-4xl uppercase tracking-tight text-epct-green/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-black uppercase tracking-tight text-epct-dark">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-epct-ink/75">{f.desc}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <CategoriesReveal />

      <section className="w-full border-y border-epct-green/20 bg-gradient-to-b from-white to-epct-bg/20 px-5 py-20 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <ScrollReveal>
            <p className="font-display text-sm uppercase tracking-[0.25em] text-epct-green">{copy.activityEyebrow}</p>
            <h2 className="mt-2 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">
              {copy.activityTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-epct-ink/78 md:text-xl">
              {copy.activityText}
            </p>
            <ul className="mt-6 space-y-3 text-base font-medium text-epct-ink/82 md:text-lg">
              {copy.activityPoints.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <Link
              href="/a-propos"
              className="mt-8 inline-block rounded-full border border-epct-dark px-7 py-3 text-sm font-semibold uppercase tracking-wider text-epct-dark transition hover:bg-epct-dark hover:text-white"
            >
              {copy.learnMore}
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="grid grid-cols-2 gap-4 md:gap-5">
            {copy.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-epct-green/15 bg-white/75 p-6 text-center shadow-[0_20px_35px_-28px_rgba(31,122,77,0.45)] backdrop-blur-sm"
              >
                <p className="font-display text-5xl uppercase text-epct-dark md:text-6xl">{s.val}</p>
                <p className="mt-2 text-sm uppercase tracking-wider text-epct-ink/70">{s.label}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      <SuppliersSlider />

      <section className="w-full bg-epct-dark px-5 py-16 text-white md:px-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <ScrollReveal>
            <p className="font-display text-xs uppercase tracking-[0.25em] text-epct-lime">{copy.directContact}</p>
            <h3 className="mt-2 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">
              {copy.urgentTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {copy.urgentText}
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1} className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/contact"
              className="rounded bg-epct-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink"
            >
              {copy.contactForm}
            </Link>
            <a
              href="https://wa.me/21658348436"
              className="rounded border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
            >
              {copy.whatsapp}
            </a>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
