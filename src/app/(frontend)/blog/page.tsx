import Image from 'next/image';
import { cookies } from 'next/headers';
import { SiteShell } from '@/components/site/SiteShell';
import { BlogIndexClient } from '@/components/blog/BlogIndexClient';
import { getPublicBlogs, type PublicLocale } from '@/lib/public-api';

export const metadata = {
  title: 'Blog | EPCT',
};

export default async function BlogPage() {
  const locale = (((await cookies()).get('site-locale')?.value as PublicLocale | undefined) ?? 'fr');
  const posts = await getPublicBlogs(locale);
  const copy = {
    fr: {
      eyebrow: 'Blog',
      title: 'Actualites, conseils et lecture terrain',
      text:
        'Retrouvez les articles EPCT autour des pompes a beton, malaxeurs, centrales a beton, pieces techniques, conseils d exploitation et sujets utiles pour les professionnels du beton en Tunisie.',
      imageAlt: 'Blog EPCT Tunisie',
    },
    en: {
      eyebrow: 'Blog',
      title: 'News, advice and field insight',
      text:
        'Discover EPCT articles around concrete pumps, mixers, batching plants, technical spare parts, operating advice and useful topics for concrete professionals in Tunisia.',
      imageAlt: 'EPCT Tunisia blog',
    },
    ar: {
      eyebrow: 'المدونة',
      title: 'مستجدات ونصائح وقراءة ميدانية',
      text:
        'اكتشف مقالات EPCT حول مضخات الخرسانة والخلاطات ومحطات الخرسانة وقطع الغيار التقنية ونصائح الاستغلال والمواضيع المفيدة للمهنيين في قطاع الخرسانة في تونس.',
      imageAlt: 'مدونة EPCT تونس',
    },
  }[locale];

  return (
    <SiteShell>
      <main className="px-0 pb-14 pt-0 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-4xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">
                {copy.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-2xl uppercase text-epct-dark md:text-3xl">
                {copy.title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                {copy.text}
              </p>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
              <Image
                src="/img/blog_post_title_image.png"
                alt={copy.imageAlt}
                width={1600}
                height={1200}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </section>

          <BlogIndexClient posts={posts} />
        </div>
      </main>
    </SiteShell>
  );
}
