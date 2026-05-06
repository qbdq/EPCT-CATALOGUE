import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { CategoriesReveal } from '@/components/home/CategoriesReveal';
import { BrandsReveal } from '@/components/home/BrandsReveal';

const features = [
  {
    icon: '⚙',
    title: 'Stock stratégique',
    desc: 'Références clés sélectionnées pour limiter les immobilisations chantier.',
  },
  {
    icon: '⚡',
    title: 'Réactivité terrain',
    desc: 'Réponse rapide pour identifier et acheminer la bonne pièce.',
  },
  {
    icon: '📍',
    title: 'Ancrage local',
    desc: 'Opérateur tunisien dédié aux professionnels du béton en Tunisie.',
  },
];


export default function HomePage() {
  return (
    <SiteShell>
      <main className="w-full">

        {/* ── Hero ── */}
        <section className="relative w-full overflow-hidden bg-epct-dark px-5 py-20 text-white md:px-10 md:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_60%_120%,rgba(31,122,77,0.35),transparent)]" />
          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-epct-lime/5 blur-3xl" />
          <div className="relative mx-auto w-full max-w-7xl">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-epct-lime">EPCT Tunisie</p>
            <h1 className="mt-4 max-w-5xl font-display text-display-lg uppercase leading-tight">
              Pièces pour centrales<br className="hidden md:block" /> et pompes à béton
            </h1>
            <p className="mt-5 max-w-2xl text-base text-white/80 md:text-lg">
              Catalogue professionnel de pièces techniques. Disponibilité, réactivité et
              accompagnement pour vos opérations chantier.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalogue"
                className="rounded bg-epct-lime px-6 py-3 text-sm font-semibold uppercase tracking-wider text-epct-ink transition hover:bg-lime-300"
              >
                Voir le catalogue
              </Link>
              <Link
                href="/contact"
                className="rounded border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                Demander un devis
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-white/10 pt-8">
              <span className="text-xs uppercase tracking-[0.3em] text-white/25">Marques :</span>
              {['Putzmeister', 'Schwing', 'CIFA', 'Zoomlion'].map((b) => (
                <span key={b} className="font-display text-sm font-semibold uppercase tracking-wider text-white/50 transition hover:text-epct-lime">{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Brands scroll-reveal (with truck images) ── */}
        <BrandsReveal />

        {/* ── 3 features ── */}
        <section className="w-full bg-white px-5 py-16 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <ScrollReveal>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-epct-green">Notre approche</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-epct-dark">Pourquoi EPCT ?</h2>
            </ScrollReveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 0.1}>
                  <article className="rounded border border-epct-green/15 p-6">
                    <span className="text-3xl">{f.icon}</span>
                    <h3 className="mt-3 font-display text-2xl uppercase text-epct-dark">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-epct-ink/70">{f.desc}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories scroll-reveal ── */}
        <CategoriesReveal />

        {/* ── About strip ── */}
        <section className="w-full border-y border-epct-green/20 bg-white px-5 py-16 md:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-epct-green">Notre activité</p>
              <h2 className="mt-2 font-display text-4xl uppercase text-epct-dark">Solutions autour du béton</h2>
              <p className="mt-4 max-w-xl text-epct-ink/70 leading-relaxed">
                EPCT accompagne les entreprises de travaux publics et BTP dans la maintenance et
                l&apos;approvisionnement de leurs systèmes de transport et de pompage béton. Une expertise
                locale, un catalogue ciblé, une réponse rapide.
              </p>
              <Link
                href="/a-propos"
                className="mt-6 inline-block rounded border border-epct-dark px-5 py-2.5 text-sm font-semibold uppercase tracking-wider text-epct-dark transition hover:bg-epct-dark hover:text-white"
              >
                En savoir plus
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="grid grid-cols-2 gap-4">
              {[
                { val: '5+', label: 'Marques référencées' },
                { val: '3', label: 'Segments produits' },
                { val: '100%', label: 'Marché tunisien' },
                { val: '24h', label: 'Délai de réponse cible' },
              ].map((s) => (
                <div key={s.label} className="rounded border border-epct-green/15 bg-epct-bg p-5 text-center">
                  <p className="font-display text-4xl uppercase text-epct-dark">{s.val}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-epct-ink/60">{s.label}</p>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* ── CTA dark ── */}
        <section className="w-full bg-epct-dark px-5 py-16 text-white md:px-10">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <ScrollReveal>
              <p className="font-display text-xs uppercase tracking-[0.25em] text-epct-lime">Contact direct</p>
              <h3 className="mt-2 font-display text-4xl uppercase">Un besoin urgent de pièce ?</h3>
              <p className="mt-3 max-w-2xl text-white/75 leading-relaxed">
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
