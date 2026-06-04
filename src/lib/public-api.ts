type PayloadListResponse<T> = {
  docs: T[];
};

type RelationDoc = {
  id: string;
  name: string;
  slug: string;
};

type MediaDoc = {
  id: string;
  alt?: string;
  url?: string;
  filename?: string;
};

export type PublicBrand = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  badgeColor?: string;
  logo?: MediaDoc | string | null;
  featuredImage?: MediaDoc | string | null;
};

export type PublicTruckCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: MediaDoc | string | null;
};

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type PublicTruckModel = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: MediaDoc | string | null;
  brand?: RelationDoc | string | null;
  truckCategory?: RelationDoc | string | null;
};

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  reference: string;
  fullDescription?: unknown;
  additionalInfo?: unknown;
  featured?: boolean;
  active?: boolean;
  stockStatus?: 'in-stock' | 'out-of-stock' | 'on-order' | string;
  brand?: RelationDoc | string | Array<RelationDoc | string> | null;
  category?: RelationDoc | string | null;
  truckCategory?: RelationDoc | string | null;
  truckModel?: RelationDoc | string | Array<RelationDoc | string> | null;
  images?: Array<{
    image?: MediaDoc | string | null;
    alt?: string;
  }>;
  sizes?: Array<{
    label?: string;
    value?: string;
  }>;
};

export type PublicBlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  postType?: 'blog' | 'nouveaute' | string;
  author?: string;
  coverImage?: MediaDoc | string | null;
  coverImageTitle?: string;
  gallery?: Array<{
    id?: string;
    title?: string;
    image?: MediaDoc | string | null;
  }>;
  tags?: Array<{
    id?: string;
    label?: string;
  }>;
  similarPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    author?: string;
    publishedAt?: string;
    coverImage?: MediaDoc | string | null;
  }>;
  content?: unknown;
  publishedAt?: string;
  featured?: boolean;
};

export type PublicAboutPage = {
  heroImage?: MediaDoc | string | null;
  gallery?: Array<{
    id?: string;
    title?: string;
    description?: string;
    image?: MediaDoc | string | null;
  }>;
  seo?: {
    title?: string;
    description?: string;
  };
};

export type PublicGlobalSettings = {
  companyName?: string;
  phone?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  facebook?: string;
  tiktok?: string;
  cataloguePDFs?: Array<{
    file?: MediaDoc | string | null;
    title?: string;
  }>;
};

export type ProductFilters = {
  brands?: string[];
  productCategories?: string[];
  categories?: string[];
  models?: string[];
  stockStatuses?: string[];
  query?: string;
};

export type PublicLocale = 'fr' | 'en' | 'ar';

function getSiteURL() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

async function fetchPayloadList<T>(path: string): Promise<T[]> {
  const url = `${getSiteURL()}${path}`;
  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const json = (await res.json()) as PayloadListResponse<T>;
  return Array.isArray(json.docs) ? json.docs : [];
}

async function fetchPayloadGlobal<T>(path: string): Promise<T | null> {
  const url = `${getSiteURL()}${path}`;
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) return null;

  return (await res.json()) as T;
}

function withLocale(path: string, locale?: PublicLocale) {
  if (!locale) return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}

function relationMatches(relation: RelationDoc | string | null | undefined, slug?: string) {
  if (!slug) return true;
  if (!relation) return false;
  if (typeof relation === 'string') return relation === slug;
  return relation.slug === slug || relation.id === slug;
}

function relationMatchesAny(
  relation: RelationDoc | string | Array<RelationDoc | string> | null | undefined,
  slugs?: string[],
) {
  if (!slugs?.length) return true;
  if (!relation) return false;

  const relationValues = Array.isArray(relation) ? relation : [relation];

  return slugs.some((slug) =>
    relationValues.some((value) => {
      if (typeof value === 'string') return value === slug;
      return value.slug === slug || value.id === slug;
    }),
  );
}

export function getMediaUrl(media?: MediaDoc | string | null) {
  if (!media) return null;
  if (typeof media === 'string') {
    if (media.startsWith('/')) return media;
    return media;
  }
  if (media.url) {
    return media.url.startsWith('http') ? media.url : media.url;
  }
  if (media.filename) {
    return `/api/media/file/${media.filename}`;
  }
  return null;
}

export async function getPublicBrands(locale?: PublicLocale): Promise<PublicBrand[]> {
  return fetchPayloadList<PublicBrand>(withLocale('/api/brands?limit=100&sort=name&depth=1', locale));
}

export async function getPublicTruckCategories(locale?: PublicLocale): Promise<PublicTruckCategory[]> {
  return fetchPayloadList<PublicTruckCategory>(
    withLocale('/api/truck-categories?limit=100&sort=name&depth=1', locale),
  );
}

export async function getPublicCategories(locale?: PublicLocale): Promise<PublicCategory[]> {
  return fetchPayloadList<PublicCategory>(withLocale('/api/categories?limit=100&sort=name&depth=1', locale));
}

export async function getPublicTruckModels(locale?: PublicLocale): Promise<PublicTruckModel[]> {
  return fetchPayloadList<PublicTruckModel>(withLocale('/api/truck-models?limit=200&sort=name&depth=1', locale));
}

export async function getPublicProducts(
  filters: ProductFilters = {},
  locale?: PublicLocale,
): Promise<PublicProduct[]> {
  const products = await fetchPayloadList<PublicProduct>(
    withLocale('/api/products?limit=200&sort=-featured,-updatedAt&depth=1', locale),
  );

  return products.filter((product) => {
    const isActive = product.active !== false;
    const matchesBrand = relationMatchesAny(product.brand, filters.brands);
    const matchesProductCategory = relationMatchesAny(product.category, filters.productCategories);
    const matchesCategory = relationMatchesAny(product.truckCategory, filters.categories);
    const matchesModel = relationMatchesAny(product.truckModel, filters.models);
    const matchesStock =
      !filters.stockStatuses?.length ||
      (!!product.stockStatus && filters.stockStatuses.includes(product.stockStatus));
    const query = filters.query?.trim().toLowerCase();
    const haystack = [
      product.name,
      product.shortDescription,
      product.reference,
      product.fullDescription ? JSON.stringify(product.fullDescription) : '',
      product.additionalInfo ? JSON.stringify(product.additionalInfo) : '',
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesQuery = !query || haystack.includes(query);

    return (
      isActive &&
      matchesBrand &&
      matchesProductCategory &&
      matchesCategory &&
      matchesModel &&
      matchesStock &&
      matchesQuery
    );
  });
}

export async function getPublicProductBySlug(slug: string, locale?: PublicLocale): Promise<PublicProduct | null> {
  const products = await fetchPayloadList<PublicProduct>(
    withLocale(`/api/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`, locale),
  );

  return products[0] ?? null;
}

export async function getPublicBlogs(locale?: PublicLocale): Promise<PublicBlog[]> {
  return fetchPayloadList<PublicBlog>(withLocale('/api/blogs?limit=24&sort=-publishedAt&depth=2', locale));
}

export async function getPublicBlogBySlug(slug: string, locale?: PublicLocale): Promise<PublicBlog | null> {
  const blogs = await fetchPayloadList<PublicBlog>(
    withLocale(`/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`, locale),
  );

  return blogs[0] ?? null;
}

export async function getPublicAboutPage(locale?: PublicLocale): Promise<PublicAboutPage | null> {
  return fetchPayloadGlobal<PublicAboutPage>(withLocale('/api/globals/about-page?depth=2', locale));
}

export async function getPublicGlobalSettings(locale?: PublicLocale): Promise<PublicGlobalSettings | null> {
  return fetchPayloadGlobal<PublicGlobalSettings>(withLocale('/api/globals/global-settings', locale));
}
