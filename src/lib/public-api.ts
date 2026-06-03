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
  featured?: boolean;
  brand?: RelationDoc | string | null;
  truckCategory?: RelationDoc | string | null;
  truckModel?: RelationDoc | string | null;
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
};

export type ProductFilters = {
  brand?: string;
  category?: string;
  model?: string;
};

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

function relationMatches(relation: RelationDoc | string | null | undefined, slug?: string) {
  if (!slug) return true;
  if (!relation) return false;
  if (typeof relation === 'string') return relation === slug;
  return relation.slug === slug || relation.id === slug;
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

export async function getPublicBrands(): Promise<PublicBrand[]> {
  return fetchPayloadList<PublicBrand>('/api/brands?limit=100&sort=name&depth=1');
}

export async function getPublicTruckCategories(): Promise<PublicTruckCategory[]> {
  return fetchPayloadList<PublicTruckCategory>('/api/truck-categories?limit=100&sort=name&depth=1');
}

export async function getPublicTruckModels(): Promise<PublicTruckModel[]> {
  return fetchPayloadList<PublicTruckModel>('/api/truck-models?limit=200&sort=name&depth=1');
}

export async function getPublicProducts(filters: ProductFilters = {}): Promise<PublicProduct[]> {
  const products = await fetchPayloadList<PublicProduct>(
    '/api/products?limit=200&sort=-featured,-updatedAt&depth=1',
  );

  return products.filter((product) => {
    const matchesBrand = relationMatches(product.brand, filters.brand);
    const matchesCategory = relationMatches(product.truckCategory, filters.category);
    const matchesModel = relationMatches(product.truckModel, filters.model);

    return matchesBrand && matchesCategory && matchesModel;
  });
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  const products = await fetchPayloadList<PublicProduct>(
    `/api/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
  );

  return products[0] ?? null;
}

export async function getPublicBlogs(): Promise<PublicBlog[]> {
  return fetchPayloadList<PublicBlog>('/api/blogs?limit=24&sort=-publishedAt&depth=2');
}

export async function getPublicBlogBySlug(slug: string): Promise<PublicBlog | null> {
  const blogs = await fetchPayloadList<PublicBlog>(
    `/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=2`,
  );

  return blogs[0] ?? null;
}

export async function getPublicAboutPage(): Promise<PublicAboutPage | null> {
  return fetchPayloadGlobal<PublicAboutPage>('/api/globals/about-page?depth=2');
}

export async function getPublicGlobalSettings(): Promise<PublicGlobalSettings | null> {
  return fetchPayloadGlobal<PublicGlobalSettings>('/api/globals/global-settings');
}
