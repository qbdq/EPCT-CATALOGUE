import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicBlogBySlug } from '@/lib/public-api';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicBlogBySlug(slug);

  if (!post) notFound();

  return (
    <SiteShell>
      <main className="container py-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Blog</p>
        <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">{post.title}</h1>
        <p className="mt-6 max-w-3xl text-epct-ink/80">{post.excerpt}</p>
      </main>
    </SiteShell>
  );
}
