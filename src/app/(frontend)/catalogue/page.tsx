import { SiteShell } from '@/components/site/SiteShell';
import { CatalogueExplorer } from '@/components/catalogue/CatalogueExplorer';
import Image from 'next/image';
import { Mail, MessageCircle } from 'lucide-react';
import {
  getPublicBrands,
  getPublicCategories,
  getPublicGlobalSettings,
  getMediaUrl,
  getPublicProducts,
  getPublicTruckCategories,
  getPublicTruckModels,
} from '@/lib/public-api';

export const metadata = {
  title: 'Catalogue | EPCT',
};

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M13.5 21v-7.2H16l.4-2.8h-2.9V9.2c0-.8.3-1.4 1.5-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v2.8h2.6V21h2.9Z" />
    </svg>
  );
}

function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M14.8 3c.4 2 1.6 3.3 3.6 3.7v2.7c-1.5 0-2.7-.4-3.8-1.1v6.1c0 3-2.2 5.2-5.2 5.2S4.2 17.4 4.2 14.5c0-3 2.2-5.1 5.1-5.1.3 0 .7 0 1 .1v2.9a3 3 0 0 0-1-.2c-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.4-1 2.4-2.4V3h3.1Z" />
    </svg>
  );
}

type CataloguePageProps = {
  searchParams?: Promise<{
    brand?: string;
    productCategory?: string;
    category?: string;
    model?: string;
    q?: string;
  }>;
};

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialFilters = {
    brands: resolvedSearchParams.brand ? [resolvedSearchParams.brand] : [],
    productCategories: resolvedSearchParams.productCategory
      ? [resolvedSearchParams.productCategory]
      : [],
    categories: resolvedSearchParams.category ? [resolvedSearchParams.category] : [],
    models: resolvedSearchParams.model ? [resolvedSearchParams.model] : [],
    query: resolvedSearchParams.q ?? '',
  };

  const [products, brands, categories, truckCategories, truckModels, globalSettings] = await Promise.all([
    getPublicProducts(),
    getPublicBrands(),
    getPublicCategories(),
    getPublicTruckCategories(),
    getPublicTruckModels(),
    getPublicGlobalSettings(),
  ]);
  const latestCataloguePDF =
    globalSettings?.cataloguePDFs
      ?.slice()
      .reverse()
      .find((item) => !!getMediaUrl(item.file)) ?? null;
  const latestCataloguePDFUrl = getMediaUrl(latestCataloguePDF?.file);

  return (
    <SiteShell>
      <main className="px-0 pb-14 pt-4 md:pb-16 md:pt-5">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="max-w-4xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">
                Catalogue
              </p>
              <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
                  Recherche professionnelle de pieces
                </h1>
                {latestCataloguePDFUrl ? (
                  <a
                    href={latestCataloguePDFUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex min-h-12 shrink-0 items-center justify-center bg-epct-green px-5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
                  >
                    Telecharger le catalogue PDF
                  </a>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                Recherchez vos pieces par marque, categorie camion, modele, disponibilite ou code
                produit. Le catalogue a ete repense pour une lecture plus rapide et plus utile.
              </p>
            </div>

            <div className="relative aspect-[16/8] overflow-hidden bg-neutral-100">
              <Image
                src="/img/pieces_beton_catalogue.png"
                alt="Catalogue EPCT"
                width={1600}
                height={900}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </section>

          <section className="border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8">
            <CatalogueExplorer
              products={products}
              brands={brands}
              categories={categories}
              truckCategories={truckCategories}
              truckModels={truckModels}
              initialFilters={initialFilters}
            />
          </section>

          <section className="border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8">
            <div className="grid gap-5">
              <div>
                <p className="font-display text-2xl uppercase text-epct-dark">
                  Restons connectes
                </p>
                <p className="mt-2 text-sm leading-relaxed text-epct-ink/68 md:text-base">
                  Suivez l'activite EPCT, partagez une demande rapide ou contactez-nous
                  directement pour vos pieces, pompes a beton, malaxeurs et equipements de
                  centrale.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
              {globalSettings?.whatsappNumber ? (
                <a
                  href={`https://wa.me/${globalSettings.whatsappNumber.replace(/[^\d]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-epct-dark px-4 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-white/10 text-epct-lime">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  WhatsApp
                </a>
              ) : null}

              {globalSettings?.email ? (
                <a
                  href={`mailto:${globalSettings.email}`}
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <Mail className="h-4 w-4" />
                  </span>
                  Email
                </a>
              ) : null}

              {globalSettings?.facebook ? (
                <a
                  href={globalSettings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <FacebookMark />
                  </span>
                  Facebook
                </a>
              ) : null}

              {globalSettings?.tiktok ? (
                <a
                  href={globalSettings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <TikTokMark />
                  </span>
                  TikTok
                </a>
              ) : null}
            </div>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
