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
        <p className="mt-2 text-sm uppercase tracking-wider text-epct-ink/60">Réf. {product.reference}</p>
        <p className="mt-6 max-w-3xl text-epct-ink/80">{product.shortDescription}</p>
      </main>
    </SiteShell>
  );
}
