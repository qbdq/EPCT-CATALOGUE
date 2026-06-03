'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type GalleryItem = {
  id?: string;
  title?: string;
  description?: string;
  imageUrl: string;
};

type AboutGalleryProps = {
  items: GalleryItem[];
};

export function AboutGallery({ items }: AboutGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (activeIndex === null) return;

      if (event.key === 'Escape') {
        setActiveIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => {
          if (current === null) return current;
          return current === 0 ? items.length - 1 : current - 1;
        });
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => {
          if (current === null) return current;
          return current === items.length - 1 ? 0 : current + 1;
        });
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  function scrollSlider(direction: 'prev' | 'next') {
    const slider = sliderRef.current;
    if (!slider) return;

    const amount = Math.max(slider.clientWidth * 0.9, 280);
    slider.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  }

  return (
    <>
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.12em] text-epct-ink/55">
            Visualiser les realisations
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollSlider('prev')}
              className="inline-flex h-10 w-10 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green/35 hover:text-epct-green"
              aria-label="Defiler vers la gauche"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollSlider('next')}
              className="inline-flex h-10 w-10 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green/35 hover:text-epct-green"
              aria-label="Defiler vers la droite"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] [scroll-snap-type:x_mandatory]"
        >
          {items.map((item, index) => (
            <button
              key={`${item.id ?? 'gallery'}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group min-w-[88%] max-w-[88%] shrink-0 overflow-hidden border border-epct-ink/10 bg-[#f8f8f6] text-left transition hover:border-epct-green/35 hover:shadow-[0_12px_32px_rgba(16,24,40,0.10)] [scroll-snap-align:start] sm:min-w-[72%] sm:max-w-[72%] lg:min-w-[calc(50%-0.5rem)] lg:max-w-[calc(50%-0.5rem)]"
            >
              <div className="relative aspect-[4/2] overflow-hidden bg-neutral-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title || 'Realisation EPCT Tunisie'}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 48vw, (min-width: 640px) 72vw, 88vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
                  <p className="font-display text-lg uppercase text-white">
                    {item.title || `Realisation ${index + 1}`}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

      </div>

      {activeItem && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[9999] h-screen w-screen bg-black/95">
              <div
                className="absolute inset-0 h-full w-full bg-black/70 backdrop-blur-sm"
                onClick={() => setActiveIndex(null)}
              />

              <div className="relative flex h-screen w-screen flex-col px-4 py-4 md:px-8 md:py-6">
                <div className="pointer-events-none mb-4 flex items-start justify-between gap-4">
                  <div className="pointer-events-auto min-w-0 rounded-sm bg-black/55 px-4 py-3">
                    <p className="font-display text-xl uppercase text-white md:text-2xl">
                      {activeItem.title || `Realisation ${activeIndex! + 1}`}
                    </p>
                    {activeItem.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/78 md:text-base">
                        {activeItem.description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveIndex(null)}
                    className="pointer-events-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-white/25 bg-black/65 text-white transition hover:bg-black/85"
                    aria-label="Fermer la galerie"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative flex-1 overflow-hidden">
                  <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 md:left-6">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((current) =>
                          current === null ? current : current === 0 ? items.length - 1 : current - 1,
                        )
                      }
                      className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-sm border border-white/25 bg-black/65 px-3 text-sm font-semibold text-white transition hover:bg-black/85"
                      aria-label="Image precedente"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="hidden lg:inline">Precedente</span>
                    </button>
                  </div>

                  <div className="absolute right-3 top-1/2 z-20 -translate-y-1/2 md:right-6">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex((current) =>
                          current === null ? current : current === items.length - 1 ? 0 : current + 1,
                        )
                      }
                      className="inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-sm border border-white/25 bg-black/65 px-3 text-sm font-semibold text-white transition hover:bg-black/85"
                      aria-label="Image suivante"
                    >
                      <span className="hidden lg:inline">Suivante</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="relative flex h-full items-center justify-center">
                    <div className="relative h-full w-full max-w-[calc(100vw-9rem)] md:max-w-[calc(100vw-12rem)]">
                      <Image
                        src={activeItem.imageUrl}
                        alt={activeItem.title || 'Realisation EPCT Tunisie'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="rounded-sm bg-black/55 px-3 py-2 text-sm text-white/88">
                    Image {activeIndex! + 1} sur {items.length}
                  </p>

                  <div className="flex flex-wrap gap-2 rounded-sm bg-black/55 px-3 py-3">
                    {items.map((item, index) => (
                      <button
                        key={`${item.id ?? 'gallery-thumb'}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={[
                          'h-2.5 w-8 transition',
                          index === activeIndex ? 'bg-epct-green' : 'bg-white/25 hover:bg-white/45',
                        ].join(' ')}
                        aria-label={`Voir l image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
