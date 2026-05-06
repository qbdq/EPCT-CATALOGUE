import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';

const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/revalidate`;

async function notify(paths: string[]) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return;

  try {
    await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // noop in local dev
  }
}

export const onDocChange: CollectionAfterChangeHook = async ({ doc, collection }) => {
  const slug = (doc as { slug?: string }).slug;
  const base = collection.slug === 'products' ? '/catalogue' : `/${collection.slug}`;
  const paths = ['/', base, slug ? `${base}/${slug}` : base];
  await notify(paths);
  return doc;
};

export const onDocDelete: CollectionAfterDeleteHook = async ({ collection }) => {
  const base = collection.slug === 'products' ? '/catalogue' : `/${collection.slug}`;
  await notify(['/', base]);
};
