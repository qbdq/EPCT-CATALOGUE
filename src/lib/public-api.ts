export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  reference: string;
  featured?: boolean;
};

export type PublicBlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
  featured?: boolean;
};

type PayloadListResponse<T> = {
  docs: T[];
};

function getSiteURL() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const url = `${getSiteURL()}/api/products?limit=24&sort=-featured,-updatedAt`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const json = (await res.json()) as PayloadListResponse<PublicProduct>;
  return Array.isArray(json.docs) ? json.docs : [];
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  const url = `${getSiteURL()}/api/products?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as PayloadListResponse<PublicProduct>;
  return json.docs?.[0] ?? null;
}

export async function getPublicBlogs(): Promise<PublicBlog[]> {
  const url = `${getSiteURL()}/api/blogs?limit=24&sort=-publishedAt`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const json = (await res.json()) as PayloadListResponse<PublicBlog>;
  return Array.isArray(json.docs) ? json.docs : [];
}

export async function getPublicBlogBySlug(slug: string): Promise<PublicBlog | null> {
  const url = `${getSiteURL()}/api/blogs?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const json = (await res.json()) as PayloadListResponse<PublicBlog>;
  return json.docs?.[0] ?? null;
}
