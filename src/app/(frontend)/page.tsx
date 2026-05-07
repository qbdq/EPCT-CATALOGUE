import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { CategoriesReveal } from '@/components/home/CategoriesReveal';
import { BrandsReveal } from '@/components/home/BrandsReveal';
import { HeroShowcase } from '@/components/home/HeroShowcase';
import { SuppliersSlider } from '@/components/home/SuppliersSlider';

const features = [
  {
    icon: '⚡',
    title: 'Livraison rapide en Tunisie',
    desc: 'Livraison rapide en Tunisie dans 24h sur les références prioritaires et urgences chantier.',
  },
  {
    icon: '🤝',
    title: 'Partenaire officiel multi-marques',
    desc: 'Partenaire officiel pour les marques les plus populaires: Schwing, CIFA, Putzmeister et Zoomlion.',
  },
  {
    icon: '🛠',
    title: 'Expertise terrain & réparation',
    desc: 'Expertise en main d\'oeuvre et réparation des pompes, toupies et centrales à béton.',
  },
];


export default function HomePage() {
  return (
    <SiteShell>
      <main className="w-full">

        <HeroShowcase />

        {/* ── Brands scroll-reveal (with truck images) ── */}
        <BrandsReveal />

        {/* ── 3 features ── */}
        <section className="w-full bg-white px-5 py-20 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <ScrollReveal>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-epct-green">Notre approche</p>
              <h2 className="mt-2 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">Pourquoi EPCT ?</h2>
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-epct-ink/75 md:text-xl">
                Une méthode claire: disponibilité des références essentielles, accompagnement technique rapide
                et suivi terrain orienté résultat.
              </p>
            </ScrollReveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
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
                    <h3 className="mt-5 font-display text-3xl font-black uppercase tracking-tight text-epct-dark">{f.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-epct-ink/75">{f.desc}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories scroll-reveal ── */}
        <CategoriesReveal />

        {/* ── About strip ── */}
        <section className="w-full border-y border-epct-green/20 bg-gradient-to-b from-white to-epct-bg/20 px-5 py-20 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <ScrollReveal>
              <p className="font-display text-sm uppercase tracking-[0.25em] text-epct-green">Notre activité</p>
              <h2 className="mt-2 font-display text-5xl font-black uppercase tracking-tight text-epct-dark md:text-6xl">Solutions autour du béton</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-epct-ink/78 md:text-xl">
                EPCT accompagne les entreprises de travaux publics et BTP dans la maintenance et
                l&apos;approvisionnement de leurs systèmes de transport et de pompage béton. Une expertise
                locale, un catalogue ciblé, une réponse rapide.
              </p>
              <ul className="mt-6 space-y-3 text-base font-medium text-epct-ink/82 md:text-lg">
                <li>• Livraison rapide en Tunisie dans 24h.</li>
                <li>• Partenaire officiel pour Schwing, CIFA, Putzmeister, Zoomlion.</li>
                <li>• Expertise en main d&apos;oeuvre et réparation pompes, toupies, centrales.</li>
              </ul>
              <Link
                href="/a-propos"
                className="mt-8 inline-block rounded-full border border-epct-dark px-7 py-3 text-sm font-semibold uppercase tracking-wider text-epct-dark transition hover:bg-epct-dark hover:text-white"
              >
                En savoir plus
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="grid grid-cols-2 gap-4 md:gap-5">
              {[
                { val: '5+', label: 'Marques référencées' },
                { val: '3', label: 'Segments produits' },
                { val: '100%', label: 'Marché tunisien' },
                { val: '24h', label: 'Délai de réponse cible' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-epct-green/15 bg-white/75 p-6 text-center shadow-[0_20px_35px_-28px_rgba(31,122,77,0.45)] backdrop-blur-sm">
                  <p className="font-display text-5xl uppercase text-epct-dark md:text-6xl">{s.val}</p>
                  <p className="mt-2 text-sm uppercase tracking-wider text-epct-ink/70">{s.label}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <SuppliersSlider />

        {/* ── CTA dark ── */}
        <section className="w-full bg-epct-dark px-5 py-16 text-white md:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <ScrollReveal>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-epct-lime">Contact direct</p>
              <h3 className="mt-2 font-display text-4xl font-black uppercase tracking-tight md:text-5xl">Un besoin urgent de pièce ?</h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                Transmettez votre référence, photo ou besoin technique. Notre équipe vous répond
                rapidement avec une proposition adaptée.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="rounded bg-epct-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink"
              >
                Formulaire contact
              </Link>
              <a
                href="https://wa.me/21658348436"
                className="rounded border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white"
              >
                WhatsApp
              </a>
            </ScrollReveal>
          </div>
        </section>

      </main>
    </SiteShell>
  );
}
