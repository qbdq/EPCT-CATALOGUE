import { SiteShell } from '@/components/site/SiteShell';

export const metadata = {
  title: 'À propos | EPCT',
};

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="container py-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">À propos</p>
        <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">EPCT Tunisie</h1>
        <div className="mt-6 max-w-3xl space-y-4 text-epct-ink/80">
          <p>
            EPCT accompagne les professionnels du béton avec des pièces robustes pour centrales et
            pompes à béton.
          </p>
          <p>
            Notre priorité est d&apos;assurer disponibilité, qualité et support rapide pour limiter les
            arrêts d&apos;exploitation.
          </p>
        </div>
      </main>
    </SiteShell>
  );
}
