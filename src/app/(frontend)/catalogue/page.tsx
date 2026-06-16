import { cookies } from 'next/headers';
import { SiteShell } from '@/components/site/SiteShell';
import { CatalogueExplorer } from '@/components/catalogue/CatalogueExplorer';
import { InteractiveCatalogueButton } from '@/components/catalogue/InteractiveCatalogueButton';
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

function resolveLocale(value: string | undefined): 'fr' | 'en' | 'ar' {
  if (value === 'en' || value === 'ar') return value;
  return 'fr';
}

const cataloguePageCopy = {
  fr: {
    eyebrow: 'Catalogue',
    title: 'Recherche professionnelle de pieces',
    description:
      'Recherchez vos pieces par marque, categorie camion, modele, disponibilite ou code produit. Le catalogue a ete repense pour une lecture plus rapide et plus utile.',
    downloadPdf: 'Telecharger le catalogue PDF',
    interactive: 'Consulter le catalogue interactif',
    closeInteractive: 'Fermer le catalogue interactif',
    connected: 'Restons connectes',
    connectedBody:
      "Suivez l'activite EPCT, partagez une demande rapide ou contactez-nous directement pour vos pieces, pompes a beton, malaxeurs et equipements de centrale.",
    email: 'Email',
  },
  en: {
    eyebrow: 'Catalogue',
    title: 'Professional parts search',
    description:
      'Search your parts by brand, truck category, model, availability, or product code. The catalogue has been redesigned for faster and more useful browsing.',
    downloadPdf: 'Download the PDF catalogue',
    interactive: 'Browse the interactive catalogue',
    closeInteractive: 'Close interactive catalogue',
    connected: 'Stay connected',
    connectedBody:
      'Follow EPCT activity, send a quick request, or contact us directly for your parts, concrete pumps, mixers, and batching plant equipment.',
    email: 'Email',
  },
  ar: {
    eyebrow: 'الكتالوج',
    title: 'البحث الاحترافي عن القطع',
    description:
      'ابحث عن قطعك حسب العلامة التجارية وفئة الشاحنة والطراز والتوفر أو رمز المنتج. تمت إعادة تصميم الكتالوج ليكون أسرع وأكثر فائدة في التصفح.',
    downloadPdf: 'تحميل كتالوج PDF',
    interactive: 'تصفح الكتالوج التفاعلي',
    closeInteractive: 'إغلاق الكتالوج التفاعلي',
    connected: 'ابقوا على تواصل',
    connectedBody:
      'تابعوا نشاط EPCT، وأرسلوا طلبا سريعا، أو تواصلوا معنا مباشرة بخصوص قطع الغيار ومضخات الخرسانة والخلاطات ومعدات محطات الخرسانة.',
    email: 'البريد الإلكتروني',
  },
} as const;

export const metadata = {
  title: 'Catalogue | EPCT',
};
const DEFAULT_CALAMEO_PUBLICATION_URL = 'https://www.calameo.com/books/008246200567eb680658d';
const DEFAULT_CALAMEO_EMBED_URL = 'https://v.calameo.com/?bkcode=008246200567eb680658d';

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
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get('site-locale')?.value);
  const copy = cataloguePageCopy[locale];
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
    getPublicProducts({}, locale),
    getPublicBrands(locale),
    getPublicCategories(locale),
    getPublicTruckCategories(locale),
    getPublicTruckModels(locale),
    getPublicGlobalSettings(locale),
  ]);
  const latestCataloguePDF =
    globalSettings?.cataloguePDFs
      ?.slice()
      .reverse()
      .find((item) => !!getMediaUrl(item.file)) ?? null;
  const latestCataloguePDFUrl = getMediaUrl(latestCataloguePDF?.file);
  const interactiveCatalogueUrl =
    globalSettings?.interactiveCatalogue?.publicationUrl || DEFAULT_CALAMEO_PUBLICATION_URL;
  const interactiveCatalogueEmbedUrl =
    globalSettings?.interactiveCatalogue?.embedUrl || DEFAULT_CALAMEO_EMBED_URL;

  return (
    <SiteShell>
      <main className="px-0 pb-14 pt-4 md:pb-16 md:pt-5">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div className="max-w-4xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">
                {copy.eyebrow}
              </p>
              <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h1 className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
                  {copy.title}
                </h1>
                {latestCataloguePDFUrl ? (
                  <a
                    href={latestCataloguePDFUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex min-h-12 shrink-0 items-center justify-center bg-epct-green px-5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
                  >
                    {copy.downloadPdf}
                  </a>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                {copy.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <InteractiveCatalogueButton
                  buttonLabel={copy.interactive}
                  closeLabel={copy.closeInteractive}
                  publicationUrl={interactiveCatalogueUrl}
                  embedUrl={interactiveCatalogueEmbedUrl}
                />
              </div>
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
              locale={locale}
              initialFilters={initialFilters}
            />
          </section>

          <section className="border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8">
            <div className="grid gap-5">
              <div>
                <p className="font-display text-2xl uppercase text-epct-dark">
                  {copy.connected}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-epct-ink/68 md:text-base">
                  {copy.connectedBody}
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
                  {copy.email}
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
