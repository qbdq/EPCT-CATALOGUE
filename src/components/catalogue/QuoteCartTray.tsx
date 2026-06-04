'use client';

import Link from 'next/link';
import { MessageCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuoteCart } from '@/components/catalogue/QuoteCartContext';

type Settings = {
  whatsappNumber?: string;
};

export function QuoteCartTray() {
  const { items, removeItem, clear } = useQuoteCart();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch('/api/globals/global-settings', { credentials: 'same-origin' });
        if (!response.ok) return;
        const json = (await response.json()) as Settings;
        setSettings(json);
      } catch {}
    })();
  }, []);

  const whatsappHref = useMemo(() => {
    if (!settings?.whatsappNumber || !items.length) return null;
    const number = settings.whatsappNumber.replace(/[^\d]/g, '');
    const lines = [
      'Bonjour EPCT,',
      'Je souhaite demander un devis pour les references suivantes :',
      ...items.map((item) => `- Ref: ${item.reference} | Quantite: ${item.quantity}`),
    ];
    return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [items, settings?.whatsappNumber]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 bg-white text-epct-dark transition hover:bg-epct-green hover:text-white"
        aria-label="Liste devis"
      >
        <ShoppingCart size={16} />
        {items.length ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-epct-green px-1 text-[10px] font-bold leading-none text-white">
            {items.length}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[23rem]">
          <div className="overflow-hidden border border-epct-ink/10 bg-white shadow-[0_18px_40px_rgba(16,24,40,0.12)]">
            <div className="border-b border-epct-ink/10 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-epct-green">Liste devis</p>
                  <p className="mt-1 text-sm text-epct-ink/65">
                    {items.length} reference{items.length > 1 ? 's' : ''}
                  </p>
                </div>
                {items.length ? (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-semibold text-[#b42318] transition hover:opacity-80"
                  >
                    Vider
                  </button>
                ) : null}
              </div>
            </div>

            <div className="max-h-[22rem] overflow-y-auto">
              {items.length ? (
                items.map((item) => (
                  <div key={item.slug} className="border-b border-epct-ink/10 px-4 py-3 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-epct-dark">{item.name}</p>
                        <p className="mt-1 text-xs text-epct-ink/65">Ref: {item.reference}</p>
                        <p className="mt-1 text-xs text-epct-ink/65">Quantite: {item.quantity}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="inline-flex h-8 w-8 items-center justify-center text-[#b42318] transition hover:bg-red-50"
                        aria-label={`Retirer ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-epct-ink/60">
                  Aucune piece ajoutee a la liste pour le moment.
                </div>
              )}
            </div>

            <div className="grid gap-2 border-t border-epct-ink/10 p-3">
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center justify-center gap-2 bg-epct-green px-4 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <MessageCircle size={15} />
                  Envoyer la demande WhatsApp
                </a>
              ) : null}
              <Link
                href="/catalogue"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 items-center justify-center border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:bg-epct-green/5"
              >
                Continuer la selection
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
