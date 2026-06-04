import Image from 'next/image';
import { cookies } from 'next/headers';
import { SiteShell } from '@/components/site/SiteShell';
import { BrandModelSelector } from '@/components/marques/BrandModelSelector';
import {
  getPublicBrands,
  getPublicTruckCategories,
  getPublicTruckModels,
  type PublicLocale,
} from '@/lib/public-api';

export const metadata = {
  title: 'Marques | EPCT',
};

export default async function BrandsPage() {
  const locale = (((await cookies()).get('site-locale')?.value as PublicLocale | undefined) ?? 'fr');
  const [brands, truckCategories, truckModels] = await Promise.all([
    getPublicBrands(locale),
    getPublicTruckCategories(locale),
    getPublicTruckModels(locale),
  ]);
  const copy = {
    fr: {
      eyebrow: 'Marques',
      title: 'Trouver rapidement le bon modele',
      text:
        'Selectionnez une marque, puis une categorie camion, puis le modele correspondant. Toute la navigation reste sur une seule surface pour aller plus vite.',
      imageAlt: 'Camion pompe a beton',
      empty: 'Aucune marque publiee pour le moment.',
    },
    en: {
      eyebrow: 'Brands',
      title: 'Find the right model quickly',
      text:
        'Select a brand, then a truck category, then the matching model. The whole navigation stays on a single surface for faster access.',
      imageAlt: 'Concrete pump truck',
      empty: 'No published brand at the moment.',
    },
    ar: {
      eyebrow: 'العلامات',
      title: 'اعثر بسرعة على الموديل المناسب',
      text:
        'اختر العلامة ثم فئة الشاحنة ثم الموديل المناسب. تبقى كل مراحل التصفح على سطح واحد لتسريع الوصول.',
      imageAlt: 'شاحنة مضخة خرسانة',
      empty: 'لا توجد علامات منشورة حاليا.',
    },
  }[locale];

  return (
    <SiteShell>
      <main className="px-0 pb-12 pt-0 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">{copy.eyebrow}</p>
              <h1 className="mt-2 font-display text-2xl uppercase text-epct-dark md:text-3xl">
                {copy.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                {copy.text}
              </p>
            </div>

            <div className="relative aspect-[16/7] overflow-hidden bg-neutral-100">
              <Image
                src="/img/slider_brands.png"
                alt={copy.imageAlt}
                width={1600}
                height={1000}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </div>

          {!brands.length ? (
            <div className="mt-8 rounded-md border border-dashed border-epct-green/35 p-8 text-epct-ink/70">
              {copy.empty}
            </div>
          ) : (
            <BrandModelSelector
              brands={brands}
              truckCategories={truckCategories}
              truckModels={truckModels}
            />
          )}
        </div>
      </main>
    </SiteShell>
  );
}
