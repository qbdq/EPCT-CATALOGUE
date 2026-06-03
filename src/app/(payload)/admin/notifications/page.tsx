import configPromise from '@payload-config';
import Link from 'next/link';
import { getPayload } from 'payload';
import { NotificationsInbox } from '@/payload/components/admin/NotificationsInbox';

export const metadata = {
  title: 'Notifications | Admin EPCT',
};

export default async function NotificationsPage() {
  const payload = await getPayload({ config: await configPromise });
  const submissions = await payload.find({
    collection: 'contact-submissions',
    depth: 0,
    limit: 50,
    sort: '-submittedAt',
    where: {
      dismissed: {
        not_equals: true,
      },
    },
  });

  const items = submissions.docs.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    reason: doc.reason,
    read: doc.read,
    dismissed: doc.dismissed,
    submittedAt: doc.submittedAt,
    message: doc.message,
  }));

  return (
    <main style={{ padding: '24px' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gap: 20,
        }}
      >
        <div
          style={{
            border: '1px solid rgba(16, 24, 40, 0.08)',
            background: '#fff',
            padding: '20px',
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
            Admin
          </p>
          <h1
            style={{
              margin: '8px 0 0',
              fontSize: 32,
              lineHeight: 1.05,
            }}
          >
            Notifications de contact
          </h1>
          <p
            style={{
              margin: '12px 0 0',
              maxWidth: 820,
              color: '#475467',
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Retrouvez ici les demandes de contact les plus recentes. Ouvrez une demande pour la
            consulter, marquez-la comme lue ou supprimez-la si elle n&apos;est plus utile.
          </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  minHeight: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 16px',
                  border: '1px solid rgba(16, 24, 40, 0.08)',
                  background: '#fff',
                  color: '#101828',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Accueil
              </Link>
              <Link
                href="/admin"
                style={{
                  display: 'inline-flex',
                  minHeight: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 16px',
                  background: '#0c7a59',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Panneau admin
              </Link>
            </div>
          </div>
        </div>

        <NotificationsInbox initialItems={items} />
      </div>
    </main>
  );
}
