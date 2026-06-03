'use client';

import Link from 'next/link';
import { Bell, CheckCheck, Eye, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { contactReasons } from '@/lib/contact-reasons';

type NotificationItem = {
  id: number | string;
  name?: string;
  email?: string;
  phone?: string;
  reason?: string;
  read?: boolean;
  dismissed?: boolean;
  submittedAt?: string;
};

type NotificationsTrayProps = {
  mode?: 'frontend' | 'admin';
};

function formatDate(value?: string) {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function NotificationsTray({ mode = 'frontend' }: NotificationsTrayProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [feedback, setFeedback] = useState('');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);

  const reasonLabels = useMemo(
    () => Object.fromEntries(contactReasons.map((reason) => [reason.value, reason.label])),
    [],
  );

  const unreadCount = useMemo(
    () => items.filter((item) => item.read === false).length,
    [items],
  );

  const visibleItems = useMemo(() => {
    if (filter === 'unread') return items.filter((item) => item.read === false);
    if (filter === 'read') return items.filter((item) => item.read === true);
    return items;
  }, [filter, items]);

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
    void loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    try {
      const response = await fetch('/api/contact-submissions?limit=20&sort=-submittedAt&depth=0', {
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const json = (await response.json()) as { docs?: NotificationItem[] };
      setItems(Array.isArray(json.docs) ? json.docs.filter((item) => item.dismissed !== true) : []);
    } catch {
      setItems([]);
      setFeedback("Impossible de charger les notifications pour l'instant.");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const response = await fetch(`/api/contact-submissions/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error('Patch failed');
      }

      setItems((current) =>
        current.map((item) => (String(item.id) === id ? { ...item, read: true } : item)),
      );
    } catch {
      setFeedback("Impossible de marquer cette notification comme lue pour l'instant.");
    }
  }

  async function removeOne(id: string) {
    setPendingAction(id);
    setFeedback('');

    try {
      const response = await fetch(`/api/contact-submissions/${id}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dismissed: true }),
      });

      if (!response.ok) throw new Error('Patch failed');

      setItems((current) => current.filter((item) => String(item.id) !== id));
    } catch {
      setFeedback("Impossible de retirer cette notification pour l'instant.");
    } finally {
      setPendingAction(null);
    }
  }

  async function removeAllVisible() {
    if (!visibleItems.length) return;

    setPendingAction('all');
    setFeedback('');

    try {
      for (const item of visibleItems) {
        const response = await fetch(`/api/contact-submissions/${item.id}`, {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dismissed: true }),
        });

        if (!response.ok) throw new Error('Patch failed');
      }

      const ids = new Set(visibleItems.map((item) => String(item.id)));
      setItems((current) => current.filter((item) => !ids.has(String(item.id))));
    } catch {
      setFeedback("Impossible de retirer toutes les notifications pour l'instant.");
    } finally {
      setPendingAction(null);
    }
  }

  const panelWidth = mode === 'admin' ? '24rem' : '22rem';
  const linkClass =
    mode === 'admin'
      ? 'absolute right-0 top-[calc(100%+10px)] z-50'
      : 'absolute right-0 top-[calc(100%+10px)] z-50';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-epct-green/35 bg-white text-epct-dark transition hover:bg-epct-green hover:text-white dark:border-epct-lime/35 dark:text-epct-dark-text dark:hover:bg-epct-lime/20"
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-epct-green px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className={linkClass}
          style={{ width: panelWidth }}
        >
          <div className="overflow-hidden border border-epct-ink/10 bg-white shadow-[0_18px_40px_rgba(16,24,40,0.12)]">
            <div className="border-b border-epct-ink/10 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-epct-green">
                    Notifications
                  </p>
                  <p className="mt-1 text-sm text-epct-ink/65">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                </div>
                <Link
                  href="/admin/notifications"
                  className="text-xs font-semibold text-epct-green transition hover:opacity-80"
                >
                  Voir la page complete
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[
                  ['all', 'Toutes'],
                  ['unread', 'Non lues'],
                  ['read', 'Lues'],
                ].map(([value, label]) => {
                  const active = filter === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value as 'all' | 'unread' | 'read')}
                      className={[
                        'min-h-8 px-3 text-xs font-semibold transition',
                        active
                          ? 'bg-epct-green text-white'
                          : 'border border-epct-ink/10 bg-white text-epct-dark hover:bg-epct-green/5',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={!visibleItems.length || pendingAction === 'all'}
                  onClick={() => void removeAllVisible()}
                  className="min-h-8 px-3 text-xs font-semibold text-[#b42318] transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tout retirer
                </button>
              </div>
            </div>

            {feedback ? (
              <div className="border-b border-[#fda29b] bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
                {feedback}
              </div>
            ) : null}

            <div className="max-h-[24rem] overflow-y-auto">
              {loading ? (
                <div className="px-4 py-5 text-sm text-epct-ink/60">Chargement...</div>
              ) : visibleItems.length ? (
                visibleItems.map((item) => {
                  const id = String(item.id);

                  return (
                    <div
                      key={id}
                      className={[
                        'border-b border-epct-ink/10 px-4 py-3 last:border-b-0',
                        item.read ? 'bg-white' : 'bg-epct-green/5',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-epct-dark">
                              {item.name || item.email || 'Demande'}
                            </p>
                            {item.reason ? (
                              <span className="text-[10px] uppercase tracking-[0.08em] text-epct-ink/50">
                                {reasonLabels[item.reason] ?? item.reason}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 truncate text-xs text-epct-ink/65">{item.email}</p>
                          <p className="mt-1 text-[11px] text-epct-ink/50">
                            {formatDate(item.submittedAt)}
                          </p>
                        </div>

                        {!item.read ? (
                          <span className="inline-flex shrink-0 items-center bg-epct-green/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-epct-green">
                            Nouveau
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          href={`/admin/collections/contact-submissions/${id}`}
                          onClick={() => {
                            if (!item.read) {
                              void markAsRead(id);
                            }
                            setOpen(false);
                          }}
                          className="inline-flex min-h-8 items-center justify-center gap-1.5 bg-epct-green px-3 text-xs font-semibold text-white transition hover:brightness-95"
                        >
                          <Eye size={13} />
                          Ouvrir
                        </Link>

                        {!item.read ? (
                          <button
                            type="button"
                            onClick={() => void markAsRead(id)}
                            className="inline-flex min-h-8 items-center justify-center gap-1.5 border border-epct-ink/10 bg-white px-3 text-xs font-semibold text-epct-dark transition hover:bg-epct-green/5"
                          >
                            <CheckCheck size={13} />
                            Marquer comme lue
                          </button>
                        ) : null}

                        <button
                          type="button"
                          disabled={pendingAction === id}
                          onClick={() => void removeOne(id)}
                          className="inline-flex min-h-8 items-center justify-center gap-1.5 border border-epct-ink/10 bg-white px-3 text-xs font-semibold text-[#b42318] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                          Retirer
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-5 text-sm text-epct-ink/60">
                  Aucune notification disponible dans cette vue.
                </div>
              )}
            </div>

            <div className="border-t border-epct-ink/10 p-3">
              <Link
                href="/admin/notifications"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-10 w-full items-center justify-center border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:bg-epct-green/5"
              >
                Acceder a la page complete
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
