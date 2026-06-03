import Image from 'next/image';
import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { getMediaUrl, getPublicTruckCategories } from '@/lib/public-api';

export const metadata = {
  title: 'Categories camion | EPCT',
};

export default async function TruckCategoriesPage() {
  const truckCategories = await getPublicTruckCategories();

  return (
    <SiteShell>
      <main className="px-5 py-12 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 border border-epct-ink/10 bg-white p-6 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-display text-xl uppercase tracking-[0.2em] text-epct-green">
                Categories camion
              </p>
              <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark md:text-5xl">
                Choisissez votre famille de machine
              </h1>
              <p className="mt-4 text-base leading-relaxed text-epct-ink/75 md:text-lg">
                Accedez rapidement au catalogue par type de machine. Chaque bloc applique
                directement le filtre de categorie camion.
              </p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <Image
                src="/img/segment_1.png"
                alt="Categorie camion"
                width={1600}
                height={1000}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </div>

          {!truckCategories.length ? (
            <div className="mt-10 rounded-md border border-dashed border-epct-green/35 p-8 text-epct-ink/70">
              Aucune categorie camion publiee pour le moment.
            </div>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {truckCategories.map((category) => {
                const imageUrl = getMediaUrl(category.image);

                return (
                  <Link
                    key={category.id}
                    href={`/catalogue?category=${category.slug}`}
                    className="group block overflow-hidden"
                  >
                    <article className="border border-epct-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(10,10,10,0.45)]">
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={category.name}
                            width={1200}
                            height={900}
                            className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
                            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-6 text-center font-display text-3xl uppercase text-epct-dark">
                            {category.name}
                          </div>
                        )}
                      </div>
                      <div className="bg-[#4a4a4a] px-6 py-5 text-center transition duration-300 group-hover:bg-epct-green">
                        <h2 className="font-display text-2xl uppercase text-white">{category.name}</h2>
                        {category.description ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/80">
                            {category.description}
                          </p>
                        ) : null}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  );
}
