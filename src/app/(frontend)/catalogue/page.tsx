import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicBrands, getPublicProducts, getPublicTruckModels } from '@/lib/public-api';

export const metadata = {
  title: 'Catalogue | EPCT',
};

type CataloguePageProps = {
  searchParams?: Promise<{
    brand?: string;
    category?: string;
    model?: string;
  }>;
};

function getRelationName(relation?: { name: string } | string | null) {
  return typeof relation === 'string' ? relation : relation?.name;
}

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const filters = {
    brand: resolvedSearchParams.brand,
    category: resolvedSearchParams.category,
    model: resolvedSearchParams.model,
  };

  const [products, brands, truckModels] = await Promise.all([
    getPublicProducts(filters),
    getPublicBrands(),
    getPublicTruckModels(),
  ]);

  const activeBrand = brands.find((brand) => brand.slug === filters.brand);
  const visibleCategories = Array.from(
    new Map(products.map((product) => [getRelationName(product.truckCategory), product.truckCategory])).values(),
  ).filter(Boolean);
  const filteredModels = truckModels.filter((model) => {
    if (!filters.brand && !filters.category) return true;

    const matchesBrand =
      !filters.brand || (typeof model.brand !== 'string' && model.brand?.slug === filters.brand);
    const matchesCategory =
      !filters.category ||
      (typeof model.truckCategory !== 'string' && model.truckCategory?.slug === filters.category);

    return matchesBrand && matchesCategory;
  });

  return (
    <SiteShell>
      <main className="container py-12">
        <div className="mb-8">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">Pieces disponibles</h1>
          <p className="mt-3 max-w-2xl text-epct-ink/75">
            Explorez notre selection de pieces par marque, categorie camion et modele.
          </p>
        </div>

        <div className="mb-8 grid gap-4 border border-epct-green/15 bg-white p-5 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-epct-ink/55">Marque</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/catalogue"
                className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  !filters.brand ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                }`}
              >
                Toutes
              </Link>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalogue?brand=${brand.slug}`}
                  className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                    filters.brand === brand.slug ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                  }`}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-epct-ink/55">Categorie camion</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={filters.brand ? `/catalogue?brand=${filters.brand}` : '/catalogue'}
                className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  !filters.category ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                }`}
              >
                Toutes
              </Link>
              {visibleCategories.map((category) => {
                if (!category || typeof category === 'string') return null;

                const href = `/catalogue?${new URLSearchParams({
                  ...(filters.brand ? { brand: filters.brand } : {}),
                  category: category.slug,
                }).toString()}`;

                return (
                  <Link
                    key={category.id}
                    href={href}
                    className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                      filters.category === category.slug ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-epct-ink/55">Modele camion</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/catalogue?${new URLSearchParams({
                  ...(filters.brand ? { brand: filters.brand } : {}),
                  ...(filters.category ? { category: filters.category } : {}),
                }).toString()}`}
                className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  !filters.model ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                }`}
              >
                Tous
              </Link>
              {filteredModels.map((model) => {
                const href = `/catalogue?${new URLSearchParams({
                  ...(filters.brand ? { brand: filters.brand } : {}),
                  ...(filters.category ? { category: filters.category } : {}),
                  model: model.slug,
                }).toString()}`;

                return (
                  <Link
                    key={model.id}
                    href={href}
                    className={`rounded-sm border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                      filters.model === model.slug ? 'border-epct-green bg-epct-green text-white' : 'border-epct-ink/15'
                    }`}
                  >
                    {model.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {activeBrand ? (
          <div className="mb-8 border-l-4 border-epct-green bg-epct-green/5 px-4 py-3 text-sm text-epct-ink/75">
            Catalogue filtre sur la marque <span className="font-semibold text-epct-dark">{activeBrand.name}</span>.
          </div>
        ) : null}

        {products.length === 0 ? (
          <div className="rounded-md border border-dashed border-epct-green/40 p-8 text-epct-ink/70">
            Aucun produit ne correspond aux filtres choisis.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="rounded-md border border-epct-green/15 bg-white p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  {typeof product.brand !== 'string' && product.brand ? (
                    <span className="rounded-sm bg-epct-green/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-green">
                      {product.brand.name}
                    </span>
                  ) : null}
                  {typeof product.truckCategory !== 'string' && product.truckCategory ? (
                    <span className="rounded-sm bg-neutral-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/70">
                      {product.truckCategory.name}
                    </span>
                  ) : null}
                  {typeof product.truckModel !== 'string' && product.truckModel ? (
                    <span className="rounded-sm bg-neutral-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-epct-ink/70">
                      {product.truckModel.name}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-epct-green/80">
                  {product.reference}
                </p>
                <h2 className="mt-2 font-display text-2xl uppercase text-epct-dark">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-epct-ink/75">{product.shortDescription}</p>
                <Link
                  href={`/catalogue/${product.slug}`}
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-epct-green"
                >
                  Voir detail →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
