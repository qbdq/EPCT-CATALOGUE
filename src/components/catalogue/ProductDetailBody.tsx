'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Mail, MessageCircle, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BlogRichText } from '@/components/blog/BlogRichText';
import { useQuoteCart } from '@/components/catalogue/QuoteCartContext';
import { ProtectedImage } from '@/components/media/ProtectedImage';
import { StockBadge } from '@/components/catalogue/StockBadge';
import { type PublicGlobalSettings, type PublicProduct, getMediaUrl } from '@/lib/public-api';

function getRelationArray(
  relation?:
    | { id?: string; name?: string; slug?: string }
    | string
    | Array<{ id?: string; name?: string; slug?: string } | string>
    | null,
) {
  if (!relation) return [];
  return Array.isArray(relation) ? relation : [relation];
}

type ProductDetailBodyProps = {
  product: PublicProduct;
  settings: PublicGlobalSettings | null;
  similarProducts: PublicProduct[];
};

export function ProductDetailBody({ product, settings, similarProducts }: ProductDetailBodyProps) {
  const { addItem } = useQuoteCart();
  const [activeTab, setActiveTab] = useState<'description' | 'additional'>(
    product.fullDescription ? 'description' : 'additional',
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const brands = getRelationArray(product.brand);
  const models = Array.isArray(product.truckModel)
    ? product.truckModel
    : product.truckModel
      ? [product.truckModel]
      : [];
  const gallery = product.images ?? [];
  const currentImage = gallery[activeImageIndex] || gallery[0];

  const breadcrumbLinks = [
    ...brands.map((brand, index) => ({
      key: `brand-${index}`,
      label: typeof brand === 'string' ? brand : brand.name || 'Marque',
      href:
        typeof brand === 'string'
          ? '/catalogue'
          : brand.slug
            ? `/catalogue?brand=${encodeURIComponent(brand.slug)}`
            : '/catalogue',
    })),
    typeof product.truckCategory !== 'string' && product.truckCategory?.slug
      ? {
          key: 'truck-category',
          label: product.truckCategory.name || 'Categorie camion',
          href: `/catalogue?category=${encodeURIComponent(product.truckCategory.slug)}`,
        }
      : null,
    typeof product.category !== 'string' && product.category?.slug
      ? {
          key: 'product-category',
          label: product.category.name || 'Categorie produit',
          href: `/catalogue?productCategory=${encodeURIComponent(product.category.slug)}`,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; href: string }>;

  const socialLinks = [
    settings?.facebook
      ? {
          href: settings.facebook,
          label: 'Facebook',
          icon: <span className="text-sm font-bold leading-none">f</span>,
        }
      : null,
    settings?.tiktok
      ? {
          href: settings.tiktok,
          label: 'TikTok',
          icon: <span className="text-sm font-bold leading-none">T</span>,
        }
      : null,
    settings?.email
      ? { href: `mailto:${settings.email}`, label: 'Email', icon: <Mail className="h-4 w-4" /> }
      : null,
    settings?.whatsappNumber
      ? {
          href: `https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, '')}`,
          label: 'WhatsApp',
          icon: <MessageCircle className="h-4 w-4" />,
        }
      : null,
  ].filter(Boolean) as Array<{ href: string; label: string; icon: ReactNode }>;

  const whatsappHref = useMemo(() => {
    if (!settings?.whatsappNumber) return null;

    const number = settings.whatsappNumber.replace(/[^\d]/g, '');
    const text = [
      'Bonjour EPCT,',
      'Je souhaite un renseignement sur cette piece :',
      `Produit : ${product.name}`,
      `Reference : ${product.reference}`,
      `Quantite : ${quantity}`,
    ].join('\n');

    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }, [product.name, product.reference, quantity, settings?.whatsappNumber]);

  function addCurrentProductToQuote() {
    addItem({
      slug: product.slug,
      name: product.name,
      reference: product.reference,
      quantity,
    });
  }

  function showPreviousImage() {
    if (!gallery.length) return;
    setActiveImageIndex((current) => (current === 0 ? gallery.length - 1 : current - 1));
  }

  function showNextImage() {
    if (!gallery.length) return;
    setActiveImageIndex((current) => (current === gallery.length - 1 ? 0 : current + 1));
  }

  return (
    <>
      <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-epct-ink/62 transition hover:text-epct-green"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>

          {socialLinks.length ? (
            <div className="flex flex-wrap items-center gap-4 text-epct-ink/58">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="transition hover:text-epct-green"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="grid gap-4">
          {breadcrumbLinks.length ? (
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-epct-ink/48">
              {breadcrumbLinks.map((part, index) => (
                <div key={part.key} className="flex items-center gap-2">
                  <Link href={part.href} className="transition hover:text-epct-green">
                    {part.label}
                  </Link>
                  {index < breadcrumbLinks.length - 1 ? (
                    <ChevronRight className="h-3.5 w-3.5 text-epct-ink/28" />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 group">
            <ProtectedImage
              src={getMediaUrl(currentImage?.image) || '/img/no_image.svg'}
              alt={currentImage?.alt || product.name}
              width={1400}
              height={1200}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
            {gallery.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-epct-dark transition hover:bg-white"
                  aria-label="Image precedente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-epct-dark transition hover:bg-white"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            ) : null}
          </div>

          {gallery.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {gallery.slice(0, 5).map((item, index) => {
                const thumbUrl = getMediaUrl(item.image);
                if (!thumbUrl) return null;

                return (
                  <button
                    key={`thumb-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative aspect-square overflow-hidden bg-neutral-100 ${
                      activeImageIndex === index ? 'ring-2 ring-epct-green' : ''
                    }`}
                  >
                    <ProtectedImage
                      src={thumbUrl}
                      alt={item.alt || product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="grid content-start gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <StockBadge status={product.stockStatus} />
          </div>

          <div>
            <h1 className="font-display text-4xl uppercase leading-tight text-epct-dark md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-epct-ink/74">{product.shortDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.15em]">
            {brands.map((brand, index) =>
              typeof brand === 'string' ? (
                <span
                  key={`brand-${index}-${brand}`}
                  className="rounded-sm bg-epct-green/10 px-3 py-2 text-epct-green"
                >
                  {brand}
                </span>
              ) : (
                <span
                  key={`brand-${brand.id || brand.slug || index}`}
                  className="rounded-sm bg-epct-green/10 px-3 py-2 text-epct-green"
                >
                  {brand.name}
                </span>
              ),
            )}
            {typeof product.truckCategory !== 'string' && product.truckCategory ? (
              <span className="rounded-sm bg-neutral-100 px-3 py-2 text-epct-ink/70">
                {product.truckCategory.name}
              </span>
            ) : null}
            {models.map((model, index) => (
              <span key={`model-${index}`} className="rounded-sm bg-neutral-100 px-3 py-2 text-epct-ink/70">
                {typeof model === 'string' ? model : model.name}
              </span>
            ))}
          </div>

          <div className="grid gap-3 border-t border-epct-ink/10 pt-5">
            <p className="text-sm font-semibold text-epct-dark">
              Code reference: <span className="text-epct-green">{product.reference}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex w-fit items-center border border-epct-ink/10 bg-[#f8f8f6]">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="inline-flex h-11 w-11 items-center justify-center text-epct-ink/70 transition hover:bg-white hover:text-epct-dark"
                aria-label="Diminuer la quantite"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="inline-flex min-w-14 items-center justify-center text-sm font-semibold text-epct-dark">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="inline-flex h-11 w-11 items-center justify-center text-epct-ink/70 transition hover:bg-white hover:text-epct-dark"
                aria-label="Augmenter la quantite"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addCurrentProductToQuote}
                className="inline-flex min-h-12 items-center justify-center border border-epct-ink/10 bg-white px-5 text-sm font-semibold uppercase tracking-[0.08em] text-epct-dark transition hover:bg-epct-green/5"
              >
                Ajouter a la liste
              </button>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center bg-epct-green px-5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
                >
                  Demander sur WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          {product.sizes?.length ? (
            <div className="grid gap-3 border-t border-epct-ink/10 pt-5">
              <p className="font-display text-2xl uppercase text-epct-dark">Specifications</p>
              <div className="grid gap-2">
                {product.sizes.map((item, index) => (
                  <div
                    key={`spec-${index}`}
                    className="flex items-center justify-between border border-epct-ink/10 bg-[#f8f8f6] px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-epct-ink/75">{item.label}</span>
                    <span className="font-semibold text-epct-dark">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {product.fullDescription || product.additionalInfo || similarProducts.length ? (
        <section className="grid gap-8 border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8">
          {product.fullDescription || product.additionalInfo ? (
            <>
              <div className="flex flex-wrap gap-2 border-b border-epct-ink/10 pb-4">
                {product.fullDescription ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('description')}
                    className={`inline-flex min-h-11 items-center px-4 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                      activeTab === 'description'
                        ? 'bg-epct-green text-white'
                        : 'bg-white text-epct-ink/68 hover:text-epct-dark'
                    }`}
                  >
                    Description detaillee
                  </button>
                ) : null}
                {product.additionalInfo ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('additional')}
                    className={`inline-flex min-h-11 items-center px-4 text-sm font-semibold uppercase tracking-[0.08em] transition ${
                      activeTab === 'additional'
                        ? 'bg-epct-green text-white'
                        : 'bg-white text-epct-ink/68 hover:text-epct-dark'
                    }`}
                  >
                    Informations complementaires
                  </button>
                ) : null}
              </div>

              {activeTab === 'description' && product.fullDescription ? (
                <div className="grid gap-4">
                  <BlogRichText content={product.fullDescription} />
                </div>
              ) : null}

              {activeTab === 'additional' && product.additionalInfo ? (
                <div className="grid gap-4">
                  <BlogRichText content={product.additionalInfo} />
                </div>
              ) : null}
            </>
          ) : null}

          {similarProducts.length ? (
            <div className="grid gap-4 border-t border-epct-ink/10 pt-6">
              <p className="font-display text-2xl uppercase text-epct-dark">Pieces similaires</p>
              <div className="grid gap-4 md:grid-cols-3">
                {similarProducts.map((item) => {
                  const imageUrl = getMediaUrl(item.images?.[0]?.image) || '/img/no_image.svg';
                  return (
                    <article key={item.id} className="overflow-hidden border border-epct-ink/10 bg-white">
                      <Link href={`/catalogue/${item.slug}`} className="relative block aspect-[16/10] bg-neutral-100">
                        <ProtectedImage
                          src={imageUrl}
                          alt={item.images?.[0]?.alt || item.name}
                          width={900}
                          height={700}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="grid gap-2 px-4 py-4">
                        <h3 className="font-display text-lg uppercase leading-tight text-epct-dark">
                          <Link href={`/catalogue/${item.slug}`} className="transition hover:text-epct-green">
                            {item.name}
                          </Link>
                        </h3>
                        <p className="text-sm leading-6 text-epct-ink/68">{item.shortDescription}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
