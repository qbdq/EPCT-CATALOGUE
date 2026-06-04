'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSiteLocale } from '@/components/site/LocaleProvider';
import type { PublicBrand, PublicTruckCategory, PublicTruckModel } from '@/lib/public-api';
import { getMediaUrl } from '@/lib/public-api';

type BrandModelSelectorProps = {
  brands: PublicBrand[];
  truckCategories: PublicTruckCategory[];
  truckModels: PublicTruckModel[];
};

type Step = {
  key: 'brand' | 'category' | 'model';
  label: string;
  title: string;
  description: string;
};

type SlugRelation = string | { slug?: string | null } | null | undefined;

function getRelationSlug(value: SlugRelation) {
  if (!value || typeof value === 'string') return null;
  return value.slug ?? null;
}

function getEntityImageAlt(name: string | undefined, fallback: string) {
  return name?.trim() || fallback;
}

export function BrandModelSelector({
  brands,
  truckCategories,
  truckModels,
}: BrandModelSelectorProps) {
  const { locale } = useSiteLocale();
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);
  const [selectedTruckCategorySlug, setSelectedTruckCategorySlug] = useState<string | null>(null);

  const text = {
    fr: {
      step: 'Etape',
      steps: [
        {
          key: 'brand',
          label: 'Marque',
          title: 'Choisissez une marque',
          description: 'Commencez par la marque de votre equipement.',
        },
        {
          key: 'category',
          label: 'Categorie camion',
          title: 'Choisissez une categorie camion',
          description: 'Affinez la recherche avec le type d equipement.',
        },
        {
          key: 'model',
          label: 'Modele',
          title: 'Choisissez le modele exact',
          description: 'Selectionnez le modele pour ouvrir le catalogue filtre.',
        },
      ] satisfies Step[],
      chosenBrand: 'Marque selectionnee',
      chosenCategory: 'Categorie selectionnee',
      reset: 'Reinitialiser',
      backCategories: 'Retour categories',
      noTruckType: 'Aucun type de camion n est encore relie a la marque',
      noModel: 'Aucun modele n est encore relie a la categorie',
    },
    en: {
      step: 'Step',
      steps: [
        {
          key: 'brand',
          label: 'Brand',
          title: 'Choose a brand',
          description: 'Start with your equipment brand.',
        },
        {
          key: 'category',
          label: 'Truck category',
          title: 'Choose a truck category',
          description: 'Refine the search with the equipment type.',
        },
        {
          key: 'model',
          label: 'Model',
          title: 'Choose the exact model',
          description: 'Select the model to open the filtered catalogue.',
        },
      ] satisfies Step[],
      chosenBrand: 'Selected brand',
      chosenCategory: 'Selected category',
      reset: 'Reset',
      backCategories: 'Back to categories',
      noTruckType: 'No truck type is linked yet to the brand',
      noModel: 'No model is linked yet to the category',
    },
    ar: {
      step: 'المرحلة',
      steps: [
        {
          key: 'brand',
          label: 'العلامة',
          title: 'اختر العلامة',
          description: 'ابدأ بعلامة معدتك.',
        },
        {
          key: 'category',
          label: 'فئة الشاحنة',
          title: 'اختر فئة الشاحنة',
          description: 'قم بتضييق البحث حسب نوع المعدة.',
        },
        {
          key: 'model',
          label: 'الموديل',
          title: 'اختر الموديل المناسب',
          description: 'حدد الموديل لفتح الكتالوج المفلتر.',
        },
      ] satisfies Step[],
      chosenBrand: 'العلامة المختارة',
      chosenCategory: 'الفئة المختارة',
      reset: 'اعادة التعيين',
      backCategories: 'العودة الى الفئات',
      noTruckType: 'لا يوجد نوع شاحنة مرتبط بعد بهذه العلامة',
      noModel: 'لا يوجد موديل مرتبط بعد بهذه الفئة',
    },
  }[locale];

  const steps = text.steps;

  const selectedBrand = useMemo(
    () => brands.find((brand) => brand.slug === selectedBrandSlug) ?? null,
    [brands, selectedBrandSlug],
  );

  const brandModels = useMemo(() => {
    if (!selectedBrandSlug) return [];
    return truckModels.filter((model) => getRelationSlug(model.brand) === selectedBrandSlug);
  }, [selectedBrandSlug, truckModels]);

  const visibleTruckCategories = useMemo(() => {
    if (!selectedBrandSlug) return [];

    const categorySlugs = new Set(
      brandModels
        .map((model) => getRelationSlug(model.truckCategory))
        .filter((slug): slug is string => Boolean(slug)),
    );

    return truckCategories.filter((category) => categorySlugs.has(category.slug));
  }, [brandModels, selectedBrandSlug, truckCategories]);

  const selectedTruckCategory = useMemo(
    () =>
      visibleTruckCategories.find((category) => category.slug === selectedTruckCategorySlug) ?? null,
    [selectedTruckCategorySlug, visibleTruckCategories],
  );

  const visibleModels = useMemo(() => {
    if (!selectedBrandSlug || !selectedTruckCategorySlug) return [];

    return brandModels.filter(
      (model) => getRelationSlug(model.truckCategory) === selectedTruckCategorySlug,
    );
  }, [brandModels, selectedBrandSlug, selectedTruckCategorySlug]);

  const activeStepIndex = selectedTruckCategorySlug ? 2 : selectedBrandSlug ? 1 : 0;
  const currentStep = steps[activeStepIndex];

  return (
    <section className="border border-t-0 border-epct-ink/10 bg-white">
      <div className="border-b border-epct-ink/10 px-5 py-6 md:px-8 md:py-7">
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const isCompleted = index < activeStepIndex;
            const isCurrent = index === activeStepIndex;

            return (
              <div key={step.key} className="flex items-center gap-4">
                <div
                  className={[
                    'flex h-16 w-16 shrink-0 items-center justify-center border-2 font-display text-2xl uppercase shadow-sm',
                    isCurrent
                      ? 'border-epct-green bg-epct-green text-white shadow-[0_10px_24px_rgba(12,122,89,0.18)]'
                      : 'border-neutral-500 bg-neutral-500 text-white',
                  ].join(' ')}
                >
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="h-4 overflow-hidden bg-neutral-200">
                    <div
                      className={isCurrent ? 'h-full bg-epct-green' : 'h-full bg-neutral-500'}
                      style={{
                        width: isCompleted ? '100%' : isCurrent ? '50%' : '0%',
                      }}
                    />
                  </div>
                  <p className="mt-3 font-display text-sm uppercase tracking-[0.16em] text-epct-ink/55">
                    {text.step} {index + 1}
                  </p>
                  <p className="mt-1 font-display text-lg uppercase text-epct-dark">{step.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 border-t border-epct-ink/10 pt-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-4">
            <div>
              <p className="font-display text-2xl uppercase text-epct-dark">{currentStep.title}</p>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-epct-ink/70 md:text-base">
                {currentStep.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedBrand ? (
                <div className="min-w-[220px] border border-epct-red/20 bg-epct-red/5 px-4 py-3">
                  <p className="font-display text-xs uppercase tracking-[0.18em] text-epct-ink/55">
                    {text.chosenBrand}
                  </p>
                  <p className="mt-1 font-display text-lg uppercase text-epct-dark">
                    {selectedBrand.name}
                  </p>
                </div>
              ) : null}

              {selectedTruckCategory ? (
                <div className="min-w-[220px] border border-epct-green/25 bg-epct-green/5 px-4 py-3">
                  <p className="font-display text-xs uppercase tracking-[0.18em] text-epct-ink/55">
                    {text.chosenCategory}
                  </p>
                  <p className="mt-1 font-display text-lg uppercase text-epct-dark">
                    {selectedTruckCategory.name}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedTruckCategorySlug ? (
              <button
                type="button"
                onClick={() => setSelectedTruckCategorySlug(null)}
                className="inline-flex min-h-12 items-center justify-center border border-epct-green bg-epct-green px-5 font-display text-sm uppercase tracking-[0.14em] text-white shadow-[0_10px_24px_rgba(12,122,89,0.18)] transition hover:brightness-95"
              >
                {text.backCategories}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setSelectedBrandSlug(null);
                setSelectedTruckCategorySlug(null);
              }}
              className="inline-flex min-h-12 items-center justify-center border border-epct-red bg-white px-5 font-display text-sm uppercase tracking-[0.14em] text-epct-red shadow-[0_10px_24px_rgba(227,28,37,0.08)] transition hover:bg-epct-red hover:text-white"
            >
              {text.reset}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 md:px-8 md:py-8">
        {!selectedBrandSlug ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => {
              const imageUrl = getMediaUrl(brand.featuredImage ?? brand.logo);

              return (
                <button
                  key={brand.slug}
                  type="button"
                  onClick={() => setSelectedBrandSlug(brand.slug)}
                  className="group text-left transition"
                >
                  <div className="overflow-hidden border border-epct-ink/10 bg-white">
                    <div className="relative aspect-[16/10] bg-neutral-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={getEntityImageAlt(brand.name, 'Brand image')}
                          width={1200}
                          height={750}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          sizes="(min-width: 1280px) 24rem, (min-width: 640px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-6 text-center font-display text-lg uppercase tracking-[0.14em] text-epct-ink/45">
                          {brand.name}
                        </div>
                      )}
                    </div>

                    <div className="bg-epct-dark px-5 py-4 transition group-hover:bg-epct-red">
                      <p className="font-display text-xl uppercase text-white">{brand.name}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}

        {selectedBrandSlug && !selectedTruckCategorySlug ? (
          visibleTruckCategories.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleTruckCategories.map((category) => {
                const imageUrl = getMediaUrl(category.image);

                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() => setSelectedTruckCategorySlug(category.slug)}
                    className="group text-left transition"
                  >
                    <div className="overflow-hidden border border-epct-ink/10 bg-white">
                      <div className="relative aspect-[16/10] bg-neutral-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={getEntityImageAlt(category.name, 'Truck category image')}
                            width={1200}
                            height={750}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                            sizes="(min-width: 1280px) 24rem, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-6 text-center font-display text-lg uppercase tracking-[0.14em] text-epct-ink/45">
                            {category.name}
                          </div>
                        )}
                      </div>

                      <div className="bg-epct-dark px-5 py-4 transition group-hover:bg-epct-red">
                        <p className="font-display text-xl uppercase text-white">{category.name}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-epct-green/35 px-6 py-10 text-epct-ink/70">
              {text.noTruckType} <strong>{selectedBrand?.name}</strong>.
            </div>
          )
        ) : null}

        {selectedBrandSlug && selectedTruckCategorySlug ? (
          visibleModels.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleModels.map((model) => {
                const imageUrl = getMediaUrl(model.image);
                const href = `/catalogue?brand=${selectedBrandSlug}&category=${selectedTruckCategorySlug}&model=${model.slug}`;

                return (
                  <Link key={model.slug} href={href} className="group block max-w-[420px]">
                    <div className="flex h-full flex-col overflow-hidden border border-epct-ink/10 bg-white">
                      <div className="relative h-[260px] w-full shrink-0 bg-neutral-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={getEntityImageAlt(model.name, 'Truck model image')}
                            width={1200}
                            height={750}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                            sizes="(min-width: 1280px) 24rem, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-6 text-center font-display text-lg uppercase tracking-[0.14em] text-epct-ink/45">
                            {model.name}
                          </div>
                        )}
                      </div>

                      <div className="flex min-h-[72px] items-center justify-center border-t border-white/10 bg-epct-green px-5 py-4 text-center transition group-hover:brightness-95">
                        <p className="font-display text-xl uppercase text-white">{model.name}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-epct-green/35 px-6 py-10 text-epct-ink/70">
              {text.noModel} <strong>{selectedTruckCategory?.name}</strong>.
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
