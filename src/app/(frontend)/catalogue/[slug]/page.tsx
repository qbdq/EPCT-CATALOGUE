import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicProductBySlug } from '@/lib/public-api';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) notFound();

  return (
    <SiteShell>
      <main className="container py-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Produit</p>
        <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">{product.name}</h1>
        <p className="mt-2 text-sm uppercase tracking-wider text-epct-ink/60">Ref. {product.reference}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
          {typeof product.brand !== 'string' && product.brand ? (
            <span className="rounded-sm bg-epct-green/10 px-3 py-2 text-epct-green">{product.brand.name}</span>
          ) : null}
          {typeof product.truckCategory !== 'string' && product.truckCategory ? (
            <span className="rounded-sm bg-neutral-100 px-3 py-2 text-epct-ink/70">{product.truckCategory.name}</span>
          ) : null}
          {typeof product.truckModel !== 'string' && product.truckModel ? (
            <span className="rounded-sm bg-neutral-100 px-3 py-2 text-epct-ink/70">{product.truckModel.name}</span>
          ) : null}
        </div>
        <p className="mt-6 max-w-3xl text-epct-ink/80">{product.shortDescription}</p>
      </main>
    </SiteShell>
  );
}
