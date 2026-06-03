import Image from 'next/image';
import { SiteShell } from '@/components/site/SiteShell';
import { BrandModelSelector } from '@/components/marques/BrandModelSelector';
import {
  getPublicBrands,
  getPublicTruckCategories,
  getPublicTruckModels,
} from '@/lib/public-api';

export const metadata = {
  title: 'Marques | EPCT',
};

export default async function BrandsPage() {
  const [brands, truckCategories, truckModels] = await Promise.all([
    getPublicBrands(),
    getPublicTruckCategories(),
    getPublicTruckModels(),
  ]);

  return (
    <SiteShell>
      <main className="px-0 pb-12 pt-0 md:pb-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">Marques</p>
              <h1 className="mt-2 font-display text-2xl uppercase text-epct-dark md:text-3xl">
                Trouver rapidement le bon modele
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                Selectionnez une marque, puis une categorie camion, puis le modele correspondant.
                Toute la navigation reste sur une seule surface pour aller plus vite.
              </p>
            </div>

            <div className="relative aspect-[16/7] overflow-hidden bg-neutral-100">
              <Image
                src="/img/slider_brands.png"
                alt="Camion pompe a beton"
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
              Aucune marque publiee pour le moment.
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
