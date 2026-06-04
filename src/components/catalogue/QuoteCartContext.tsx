'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type QuoteCartItem = {
  slug: string;
  name: string;
  reference: string;
  quantity: number;
};

type QuoteCartContextValue = {
  items: QuoteCartItem[];
  addItem: (item: QuoteCartItem) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const QuoteCartContext = createContext<QuoteCartContextValue | null>(null);
const STORAGE_KEY = 'epct-quote-cart';

export function QuoteCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as QuoteCartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [hydrated, items]);

  const value = useMemo<QuoteCartContextValue>(
    () => ({
      items,
      addItem: (item) => {
        setItems((current) => {
          const existing = current.find((entry) => entry.slug === item.slug);
          if (existing) {
            return current.map((entry) =>
              entry.slug === item.slug
                ? { ...entry, quantity: entry.quantity + Math.max(1, item.quantity) }
                : entry,
            );
          }
          return [...current, { ...item, quantity: Math.max(1, item.quantity) }];
        });
      },
      removeItem: (slug) => {
        setItems((current) => current.filter((item) => item.slug !== slug));
      },
      updateQuantity: (slug, quantity) => {
        setItems((current) =>
          current.map((item) =>
            item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        );
      },
      clear: () => setItems([]),
    }),
    [items],
  );

  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>;
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);
  if (!context) {
    throw new Error('useQuoteCart must be used within QuoteCartProvider');
  }
  return context;
}
