import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ProductDetailBody } from '@/components/catalogue/ProductDetailBody';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicGlobalSettings, getPublicProductBySlug, getPublicProducts } from '@/lib/public-api';

function getRelationIds(
  relation?:
    | { id?: string; slug?: string }
    | string
    | Array<{ id?: string; slug?: string } | string>
    | null,
) {
  if (!relation) return [];
  const values = Array.isArray(relation) ? relation : [relation];

  return values
    .map((value) => (typeof value === 'string' ? value : value.id || value.slug))
    .filter(Boolean) as string[];
}

function resolveLocale(value: string | undefined): 'fr' | 'en' | 'ar' {
  if (value === 'en' || value === 'ar') return value;
  return 'fr';
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get('site-locale')?.value);
  const { slug } = await params;

  const [product, allProducts, settings] = await Promise.all([
    getPublicProductBySlug(slug, locale),
    getPublicProducts({}, locale),
    getPublicGlobalSettings(locale),
  ]);

  if (!product) notFound();

  const productBrandIds = new Set(getRelationIds(product.brand));
  const productCategoryIds = new Set(getRelationIds(product.category));

  const similarProducts = allProducts
    .filter((item) => item.id !== product.id)
    .filter((item) => {
      const sameCategory = getRelationIds(item.category).some((id) => productCategoryIds.has(id));
      const sharedBrand = getRelationIds(item.brand).some((id) => productBrandIds.has(id));
      return sameCategory && sharedBrand;
    })
    .slice(0, 3);

  return (
    <SiteShell>
      <main className="px-0 pb-14 pt-0 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <ProductDetailBody product={product} settings={settings} similarProducts={similarProducts} />
        </div>
      </main>
    </SiteShell>
  );
}
