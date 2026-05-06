import configPromise from '@payload-config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
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

export default function PayloadAdminPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return RootPage({
    config: configPromise,
    importMap,
    params,
    searchParams,
  });
}
