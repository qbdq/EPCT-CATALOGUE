import { NextResponse } from 'next/server';
import { getMediaUrl, getPublicProducts, type PublicLocale } from '@/lib/public-api';

function resolveLocale(value: string | null): PublicLocale {
  if (value === 'en' || value === 'ar') return value;
  return 'fr';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';
  const locale = resolveLocale(searchParams.get('locale'));

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const products = await getPublicProducts({ query }, locale);
  const results = products.slice(0, 5).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    reference: product.reference,
    imageUrl: getMediaUrl(product.images?.[0]?.image) || '/img/no_image.svg',
    alt: product.images?.[0]?.alt || product.name || 'Product image',
  }));

  return NextResponse.json({ results });
}
