'use client';

import { BookOpen, ExternalLink, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type InteractiveCatalogueButtonProps = {
  buttonLabel: string;
  closeLabel: string;
  publicationUrl: string;
  embedUrl: string;
};

export function InteractiveCatalogueButton({
  buttonLabel,
  closeLabel,
  publicationUrl,
  embedUrl,
}: InteractiveCatalogueButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center justify-center gap-2 border border-epct-green bg-epct-green px-5 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-95"
      >
        <BookOpen className="h-4 w-4" />
        <span>{buttonLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-3 py-4 md:px-6 md:py-8">
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => setOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 flex h-[92vh] w-full max-w-7xl flex-col overflow-hidden bg-white shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-epct-ink/10 px-4 py-3 md:px-5">
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-epct-dark">
                <BookOpen className="h-4 w-4 text-epct-green" />
                <span>{buttonLabel}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center gap-2 border border-epct-ink/10 bg-white px-3 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Calameo</span>
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                  aria-label={closeLabel}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <iframe
              src={embedUrl}
              title={buttonLabel}
              className="h-full w-full flex-1 bg-white"
              allow="fullscreen"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
