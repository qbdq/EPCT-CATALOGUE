import Link from 'next/link';
import { SiteShell } from '@/components/site/SiteShell';
import { getPublicBlogs } from '@/lib/public-api';

export const metadata = {
  title: 'Blog | EPCT',
};

export default async function BlogPage() {
  const posts = await getPublicBlogs();

  return (
    <SiteShell>
      <main className="container py-12">
        <div className="mb-8">
          <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Blog</p>
          <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">Actualités & conseils</h1>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-md border border-dashed border-epct-green/40 p-8 text-epct-ink/70">
            Aucun article publié pour le moment.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article key={post.id} className="rounded-md border border-epct-green/15 bg-white p-5">
                <h2 className="font-display text-2xl uppercase text-epct-dark">{post.title}</h2>
                <p className="mt-2 text-sm text-epct-ink/75">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-semibold uppercase tracking-wider text-epct-green"
                >
                  Lire l&apos;article →
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </SiteShell>
  );
}
