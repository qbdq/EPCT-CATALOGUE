'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { type PublicBlog, getMediaUrl } from '@/lib/public-api';
import { useSiteLocale } from '@/components/site/LocaleProvider';

type BlogIndexClientProps = {
  posts: PublicBlog[];
};

const GRID_BATCH_SIZE = 3;

function getDateLocale(locale: 'fr' | 'en' | 'ar') {
  if (locale === 'en') return 'en-US';
  if (locale === 'ar') return 'ar-TN';
  return 'fr-FR';
}

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const { locale } = useSiteLocale();
  const [activeFilter, setActiveFilter] = useState<'all' | 'blog' | 'nouveaute'>('all');
  const [visibleCount, setVisibleCount] = useState(GRID_BATCH_SIZE);
  const text = {
    fr: {
      all: 'Tous',
      blog: 'Blog',
      nouveaute: 'Nouveaute',
      article: 'article',
      articles: 'articles',
      read: 'Lire',
      none: 'Aucun article publie pour le moment.',
      noneFilter: 'Aucun article disponible dans ce filtre.',
      more: 'Afficher plus de blogs',
      postTypeBlog: 'Blog',
      postTypeNews: 'Nouveaute',
      openArticle: 'Ouvrir',
    },
    en: {
      all: 'All',
      blog: 'Blog',
      nouveaute: 'News',
      article: 'article',
      articles: 'articles',
      read: 'Read',
      none: 'No published article at the moment.',
      noneFilter: 'No article available for this filter.',
      more: 'Show more blog posts',
      postTypeBlog: 'Blog',
      postTypeNews: 'News',
      openArticle: 'Open',
    },
    ar: {
      all: 'الكل',
      blog: 'مدونة',
      nouveaute: 'مستجدات',
      article: 'مقال',
      articles: 'مقالات',
      read: 'اقرأ',
      none: 'لا توجد مقالات منشورة حاليا.',
      noneFilter: 'لا توجد مقالات في هذا الفلتر.',
      more: 'عرض المزيد من المقالات',
      postTypeBlog: 'مدونة',
      postTypeNews: 'مستجدات',
      openArticle: 'افتح',
    },
  }[locale];

  function formatDate(value?: string) {
    if (!value) return '';

    try {
      return new Intl.DateTimeFormat(getDateLocale(locale), {
        dateStyle: 'long',
      }).format(new Date(value));
    } catch {
      return value;
    }
  }

  function getPostTypeLabel(value?: string) {
    if (value === 'nouveaute') return text.postTypeNews;
    return text.postTypeBlog;
  }

  function getImageAlt(post: PublicBlog) {
    return post.coverImageTitle || post.title || text.postTypeBlog;
  }

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter((post) => (post.postType || 'blog') === activeFilter);
  }, [activeFilter, posts]);

  const featuredPost = filteredPosts[0] ?? null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;
  const visiblePosts = gridPosts.slice(0, visibleCount);
  const canLoadMore = visibleCount < gridPosts.length;

  function handleFilterChange(filter: 'all' | 'blog' | 'nouveaute') {
    setActiveFilter(filter);
    setVisibleCount(GRID_BATCH_SIZE);
  }

  if (!posts.length) {
    return (
      <div className="border border-t-0 border-dashed border-epct-green/35 bg-white px-6 py-12 text-center text-epct-ink/70">
        {text.none}
      </div>
    );
  }

  return (
    <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-epct-ink/10 pb-4">
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'all', label: text.all },
            { value: 'blog', label: text.blog },
            { value: 'nouveaute', label: text.nouveaute },
          ].map((item) => {
            const isActive = activeFilter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleFilterChange(item.value as 'all' | 'blog' | 'nouveaute')}
                className={[
                  'inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold uppercase tracking-[0.08em] transition',
                  isActive
                    ? 'border-epct-green bg-epct-green text-white'
                    : 'border-epct-green/35 bg-white text-epct-green hover:bg-epct-green/5',
                ].join(' ')}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-epct-ink/60">
          {filteredPosts.length} {filteredPosts.length > 1 ? text.articles : text.article}
        </p>
      </div>

      {featuredPost ? (
        <article className="grid gap-0 bg-transparent transition">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="relative block aspect-[16/7] overflow-hidden bg-neutral-100"
          >
            <Image
              src={getMediaUrl(featuredPost.coverImage) || '/img/no_image.svg'}
              alt={getImageAlt(featuredPost)}
              width={1600}
              height={900}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
              sizes="100vw"
            />
          </Link>

          <div className="grid gap-4 px-0 py-6 md:py-7">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.08em] text-epct-ink/40">
                {featuredPost.publishedAt ? <span>{formatDate(featuredPost.publishedAt)}</span> : null}
                {featuredPost.author ? <span>{featuredPost.author}</span> : null}
              </div>

              <span className="inline-flex min-h-7 items-center rounded-full bg-[#ff2b06] px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                {getPostTypeLabel(featuredPost.postType)}
              </span>
            </div>

            <h2 className="max-w-5xl font-display text-[2.3rem] uppercase leading-tight text-epct-dark md:text-[2.7rem]">
              <Link href={`/blog/${featuredPost.slug}`} className="transition hover:text-epct-green">
                {featuredPost.title}
              </Link>
            </h2>

            <p className="max-w-4xl text-[17px] leading-8 text-epct-ink/72">{featuredPost.excerpt}</p>

            <div>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-epct-green transition hover:translate-x-0.5"
              >
                {text.read}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </article>
      ) : null}

      {visiblePosts.length ? (
        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => {
            const imageUrl = getMediaUrl(post.coverImage) || '/img/no_image.svg';

            return (
              <article key={post.id} className="grid gap-0 bg-transparent transition">
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/9] overflow-hidden bg-neutral-100"
                >
                  <Image
                    src={imageUrl}
                    alt={getImageAlt(post)}
                    width={1400}
                    height={900}
                    className="h-full w-full object-cover transition duration-300 hover:scale-[1.03]"
                    sizes="(min-width: 1280px) 31vw, (min-width: 768px) 48vw, 100vw"
                  />
                </Link>

                <div className="grid gap-4 px-0 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium uppercase tracking-[0.08em] text-epct-ink/40">
                      {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
                      {post.author ? <span>{post.author}</span> : null}
                    </div>

                    <span className="inline-flex min-h-7 items-center rounded-full bg-epct-green/10 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-epct-green">
                      {getPostTypeLabel(post.postType)}
                    </span>
                  </div>

                  <h3 className="font-display text-[1.85rem] uppercase leading-tight text-epct-dark">
                    <Link href={`/blog/${post.slug}`} className="transition hover:text-epct-green">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-[15px] leading-7 text-epct-ink/72">{post.excerpt}</p>

                  <div className="pt-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      aria-label={`${text.openArticle} ${post.title}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-epct-green transition hover:translate-x-0.5"
                    >
                      {text.read}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-epct-green/35 bg-white px-6 py-12 text-center text-epct-ink/70">
          {text.noneFilter}
        </div>
      )}

      {canLoadMore ? (
        <div className="flex justify-center border-t border-epct-ink/10 pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + GRID_BATCH_SIZE)}
            className="inline-flex min-h-12 items-center justify-center border border-epct-ink/10 bg-white px-6 text-sm font-semibold uppercase tracking-[0.08em] text-epct-dark transition hover:border-epct-green hover:text-epct-green"
          >
            {text.more}
          </button>
        </div>
      ) : null}
    </section>
  );
}
