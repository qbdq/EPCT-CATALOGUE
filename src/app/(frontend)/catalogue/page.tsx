import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicProducts } from '@/lib/public-api';

export const metadata = {
  title: 'Catalogue | EPCT',
};

export default async function CataloguePage() {
  const products = await getPublicProducts();

  return (
    <SiteShell>
      <main className="container py-12">
        <div className="mb-8">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">Pièces disponibles</h1>
          <p className="mt-3 max-w-2xl text-epct-ink/75">
            Explorez notre sélection de pièces pour centrales et pompes à béton. Cette version charge
            directement les produits depuis Payload.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-md border border-dashed border-epct-green/40 p-8 text-epct-ink/70">
            Aucun produit publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-md border border-epct-green/15 bg-white p-5">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-epct-green/80">
                  {product.reference}
                </p>
                <h2 className="mt-2 font-display text-2xl uppercase text-epct-dark">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-epct-ink/75">{product.shortDescription}</p>
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-epct-green"
                >
                  Voir détail →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
