'use client';

import Link from 'next/link';
import { BellRing, CheckCheck, Eye, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  message?: string;
};

type NotificationsInboxProps = {
  initialItems: NotificationItem[];
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

export function NotificationsInbox({ initialItems }: NotificationsInboxProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const reasonLabels = useMemo(
    () => Object.fromEntries(contactReasons.map((reason) => [reason.value, reason.label])),
    [],
  );

  const unreadCount = useMemo(
    () => items.filter((item) => item.read === false).length,
    [items],
  );

  const visibleItems = useMemo(() => {
    if (filter === 'unread') {
      return items.filter((item) => item.read === false);
    }

    if (filter === 'read') {
      return items.filter((item) => item.read === true);
    }

    return items;
  }, [filter, items]);

  async function markAsRead(id: string) {
    setPendingId(id);
    setFeedback('');

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
    } finally {
      setPendingId(null);
    }
  }

  async function removeItem(id: string) {
    setPendingId(id);
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
      setPendingId(null);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          border: '1px solid rgba(16, 24, 40, 0.08)',
          background: '#fff',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(12, 122, 89, 0.1)',
              color: '#0c7a59',
            }}
          >
            <BellRing size={18} />
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#0c7a59',
              }}
            >
              Notifications
            </p>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#475467' }}>
              {unreadCount} demande{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              minHeight: 40,
              padding: '0 16px',
              border: filter === 'all' ? '1px solid #0c7a59' : '1px solid rgba(16, 24, 40, 0.08)',
              background: filter === 'all' ? '#0c7a59' : '#fff',
              color: filter === 'all' ? '#fff' : '#101828',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Toutes
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            style={{
              minHeight: 40,
              padding: '0 16px',
              border:
                filter === 'unread' ? '1px solid #0c7a59' : '1px solid rgba(16, 24, 40, 0.08)',
              background: filter === 'unread' ? '#0c7a59' : '#fff',
              color: filter === 'unread' ? '#fff' : '#101828',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Non lues
          </button>
          <button
            type="button"
            onClick={() => setFilter('read')}
            style={{
              minHeight: 40,
              padding: '0 16px',
              border:
                filter === 'read' ? '1px solid #0c7a59' : '1px solid rgba(16, 24, 40, 0.08)',
              background: filter === 'read' ? '#0c7a59' : '#fff',
              color: filter === 'read' ? '#fff' : '#101828',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Lues
          </button>
        </div>
      </div>

      {feedback ? (
        <div
          style={{
            border: '1px solid #fda29b',
            background: '#fef3f2',
            color: '#b42318',
            padding: '12px 16px',
            fontSize: 14,
          }}
        >
          {feedback}
        </div>
      ) : null}

      {visibleItems.length ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {visibleItems.map((item) => {
            const id = String(item.id);

            return (
              <div
                key={id}
                style={{
                  display: 'grid',
                  gap: 16,
                  border: item.read
                    ? '1px solid rgba(16, 24, 40, 0.08)'
                    : '1px solid rgba(12, 122, 89, 0.2)',
                  background: item.read ? '#fff' : 'rgba(12, 122, 89, 0.05)',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ minWidth: 0, flex: '1 1 420px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#101828',
                        }}
                      >
                        {item.name || item.email || 'Demande'}
                      </p>

                      {item.reason ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#f2f4f7',
                            padding: '4px 10px',
                            fontSize: 11,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#667085',
                          }}
                        >
                          {reasonLabels[item.reason] ?? item.reason}
                        </span>
                      ) : null}

                      {!item.read ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: 'rgba(12, 122, 89, 0.1)',
                            padding: '4px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: '#0c7a59',
                          }}
                        >
                          Nouveau
                        </span>
                      ) : null}
                    </div>

                    <p style={{ margin: '10px 0 0', fontSize: 14, color: '#475467' }}>
                      {item.email}
                      {item.phone ? ` • ${item.phone}` : ''}
                    </p>

                    {item.message ? (
                      <p
                        style={{
                          margin: '10px 0 0',
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: '#667085',
                        }}
                      >
                        {item.message}
                      </p>
                    ) : null}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: '#667085',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatDate(item.submittedAt)}
                  </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <Link
                    href={`/admin/collections/contact-submissions/${id}`}
                    onClick={() => {
                      if (!item.read) {
                        void markAsRead(id);
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      minHeight: 40,
                      padding: '0 16px',
                      background: '#0c7a59',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <Eye size={15} />
                    Ouvrir
                  </Link>

                  {!item.read ? (
                    <button
                      type="button"
                      disabled={pendingId === id}
                      onClick={() => void markAsRead(id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        minHeight: 40,
                        padding: '0 16px',
                        border: '1px solid rgba(16, 24, 40, 0.08)',
                        background: '#fff',
                        color: '#101828',
                        fontSize: 14,
                        fontWeight: 600,
                        opacity: pendingId === id ? 0.6 : 1,
                        cursor: pendingId === id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <CheckCheck size={15} />
                      Lu
                    </button>
                  ) : null}

                  <button
                    type="button"
                    disabled={pendingId === id}
                    onClick={() => void removeItem(id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      minHeight: 40,
                      padding: '0 16px',
                      border: '1px solid rgba(16, 24, 40, 0.08)',
                      background: '#fff',
                      color: '#b42318',
                      fontSize: 14,
                      fontWeight: 600,
                      opacity: pendingId === id ? 0.6 : 1,
                      cursor: pendingId === id ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Trash2 size={15} />
                    Retirer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            border: '1px dashed rgba(16, 24, 40, 0.14)',
            background: '#fff',
            padding: '40px 20px',
            fontSize: 14,
            color: '#667085',
          }}
        >
          Aucune notification disponible dans cette vue.
        </div>
      )}
    </div>
  );
}
