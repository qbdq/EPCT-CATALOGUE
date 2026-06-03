import configPromise from '@payload-config';
import Link from 'next/link';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { House } from 'lucide-react';
import { importMap } from '../importMap';

type Params = Promise<{ segments: string[] }>;
type SearchParams = Promise<Record<string, string | string[]>>;

export const generateMetadata = ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) => {
  return generatePageMetadata({
    config: configPromise,
    params,
    searchParams,
  });
};

export default async function PayloadAdminPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const resolvedParams = await params;
  const isDashboardRoot = !resolvedParams?.segments?.length;

  return (
    <>
      {isDashboardRoot ? (
        <div
          style={{
            position: 'fixed',
            top: 12,
            right: 54,
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 999,
              border: '1px solid rgba(16, 24, 40, 0.08)',
              background: '#fff',
              color: '#101828',
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(16, 24, 40, 0.08)',
            }}
            aria-label="Accueil"
            title="Accueil"
          >
            <House size={16} />
          </Link>
        </div>
      ) : null}

      {RootPage({
        config: configPromise,
        importMap,
        params,
        searchParams,
      })}
    </>
  );
}
