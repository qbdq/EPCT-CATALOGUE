import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, MapPinned, MessageCircle, Music2 } from 'lucide-react';
import { BlogRichText } from '@/components/blog/BlogRichText';
import { SiteShell } from '@/components/site/SiteShell';
import {
  getMediaUrl,
  getPublicBlogBySlug,
  getPublicBlogs,
  getPublicGlobalSettings,
  type PublicLocale,
} from '@/lib/public-api';

function formatDate(value: string | undefined, locale: PublicLocale) {
  if (!value) return '';

  try {
    const formatLocale = locale === 'en' ? 'en-US' : locale === 'ar' ? 'ar-TN' : 'fr-FR';
    return new Intl.DateTimeFormat(formatLocale, {
      dateStyle: 'long',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = (((await cookies()).get('site-locale')?.value as PublicLocale | undefined) ?? 'fr');

  const [post, globalSettings, allPosts] = await Promise.all([
    getPublicBlogBySlug(slug, locale),
    getPublicGlobalSettings(locale),
    getPublicBlogs(locale),
  ]);

  if (!post) notFound();

  const coverImageUrl = getMediaUrl(post.coverImage) || '/img/blog_post_title_image.png';
  const galleryItems = (post.gallery ?? [])
    .map((item) => {
      const imageUrl = getMediaUrl(item.image);

      if (!imageUrl) return null;

      return {
        title: item.title,
        imageUrl,
      };
    })
    .filter(Boolean) as Array<{ title?: string; imageUrl: string }>;

  const whatsappUrl = globalSettings?.whatsappNumber
    ? `https://wa.me/${globalSettings.whatsappNumber.replace(/[^\d]/g, '')}`
    : 'https://wa.me/21658348436';
  const facebookUrl = globalSettings?.facebook || 'https://www.facebook.com/epct.tn/';
  const tiktokUrl = globalSettings?.tiktok || 'https://www.tiktok.com/@epct_tn';
  const googleUrl = 'https://maps.app.goo.gl/kcXkirEEMZs3K4rb8';
  const emailUrl = globalSettings?.email ? `mailto:${globalSettings.email}` : 'mailto:epctunisie@gmail.com';
  const currentIndex = allPosts.findIndex((item) => item.slug === slug);
  const previousPost = currentIndex >= 0 ? allPosts[currentIndex + 1] ?? null : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] ?? null : null;

  const copy = {
    fr: {
      back: 'Retour aux articles',
      previous: 'Article precedent',
      next: 'Article suivant',
      gallery: "Images liees a l'article",
      contact: 'Nous contacter',
      similar: 'Articles similaires',
      readArticle: "Lire l'article",
      googleLabel: 'Google Maps',
      facebookLabel: 'Facebook',
      tiktokLabel: 'TikTok',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'Email',
    },
    en: {
      back: 'Back to articles',
      previous: 'Previous article',
      next: 'Next article',
      gallery: 'Images related to this article',
      contact: 'Contact us',
      similar: 'Similar articles',
      readArticle: 'Read article',
      googleLabel: 'Google Maps',
      facebookLabel: 'Facebook',
      tiktokLabel: 'TikTok',
      whatsappLabel: 'WhatsApp',
      emailLabel: 'Email',
    },
    ar: {
      back: 'العودة الى المقالات',
      previous: 'المقال السابق',
      next: 'المقال التالي',
      gallery: 'صور مرتبطة بهذا المقال',
      contact: 'اتصل بنا',
      similar: 'مقالات مشابهة',
      readArticle: 'اقرأ المقال',
      googleLabel: 'خرائط غوغل',
      facebookLabel: 'فيسبوك',
      tiktokLabel: 'تيك توك',
      whatsappLabel: 'واتساب',
      emailLabel: 'البريد',
    },
  }[locale];

  return (
    <SiteShell>
      <main className="bg-[#f3f4f2] px-0 pb-16 pt-0 md:pb-20">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          <div className="grid gap-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/blog"
                className="inline-flex min-h-12 items-center gap-2 border border-epct-ink/10 bg-white px-5 text-sm font-semibold uppercase tracking-[0.08em] text-epct-dark transition hover:border-epct-green hover:text-epct-green"
              >
                <ArrowLeft className="h-4 w-4" />
                {copy.back}
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                {previousPost ? (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {copy.previous}
                  </Link>
                ) : null}

                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                  >
                    {copy.next}
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                ) : null}
              </div>
            </div>

            <article className="grid gap-8">
              <div className="grid gap-4">
                {post.tags?.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {post.tags.map((tag, index) =>
                      tag.label ? (
                        <span
                          key={`tag-${index}`}
                          className="inline-flex min-h-7 items-center rounded-full bg-epct-green/10 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-epct-green"
                        >
                          {tag.label}
                        </span>
                      ) : null,
                    )}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[0.08em] text-epct-ink/45">
                  {post.publishedAt ? <span>{formatDate(post.publishedAt, locale)}</span> : null}
                  {post.author ? <span>{post.author}</span> : null}
                </div>

                <h1 className="max-w-5xl font-display font-black text-[2.6rem] uppercase leading-[0.98] text-epct-dark md:text-[4.2rem]">
                  {post.title}
                </h1>

                <p className="max-w-full text-base leading-8 text-epct-ink/74 md:text-[19px]">
                  {post.excerpt}
                </p>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                <Image
                  src={coverImageUrl}
                  alt={post.coverImageTitle || post.title}
                  width={1600}
                  height={900}
                  priority
                  className="h-full w-full object-cover"
                  sizes="100vw"
                />
              </div>

              {post.content ? (
                <div className="max-w-full">
                  <BlogRichText content={post.content} />
                </div>
              ) : null}

              {galleryItems.length ? (
                <section className="grid gap-6">
                  <div className="max-w-3xl">
                    <p className="font-display text-2xl uppercase text-epct-green md:text-3xl">
                      {copy.gallery}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {galleryItems.map((item, index) => (
                      <article key={`gallery-${index}`} className="overflow-hidden border border-epct-ink/10 bg-white">
                        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.title || post.title}
                            width={1200}
                            height={900}
                            className="h-full w-full object-cover"
                            sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
                          />
                        </div>
                        {item.title ? (
                          <div className="px-4 py-4">
                            <p className="font-display text-lg uppercase text-epct-dark">{item.title}</p>
                          </div>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="grid gap-5 border-t border-epct-ink/10 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={googleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                      aria-label={copy.googleLabel}
                    >
                      <MapPinned className="h-5 w-5" />
                    </a>
                    <a
                      href={facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                      aria-label={copy.facebookLabel}
                    >
                      <span className="text-lg font-bold leading-none">f</span>
                    </a>
                    <a
                      href={tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                      aria-label={copy.tiktokLabel}
                    >
                      <Music2 className="h-5 w-5" />
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-11 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                      aria-label={copy.whatsappLabel}
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                    <a
                      href={emailUrl}
                      className="inline-flex h-11 w-11 items-center justify-center border border-epct-ink/10 bg-white text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                      aria-label={copy.emailLabel}
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>

                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center bg-epct-green px-5 text-sm font-semibold text-white transition hover:brightness-95"
                  >
                    {copy.contact}
                  </Link>
                </div>
              </div>

              {post.similarPosts?.length ? (
                <section className="grid gap-6 border-t border-epct-ink/10 pt-6">
                  <div className="max-w-3xl">
                    <p className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
                      {copy.similar}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {post.similarPosts.map((item) => {
                      const imageUrl = getMediaUrl(item.coverImage) || '/img/slider_home_4.png';

                      return (
                        <article key={item.id} className="overflow-hidden border border-epct-ink/10 bg-white">
                          <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                            <Image
                              src={imageUrl}
                              alt={item.title}
                              width={1200}
                              height={900}
                              className="h-full w-full object-cover"
                              sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 100vw"
                            />
                          </div>
                          <div className="grid gap-3 px-4 py-4">
                            <div className="text-sm text-epct-ink/60">
                              {item.author ? <span>{item.author}</span> : null}
                              {item.author && item.publishedAt ? <span> · </span> : null}
                              {item.publishedAt ? <span>{formatDate(item.publishedAt, locale)}</span> : null}
                            </div>
                            <p className="font-display text-xl uppercase text-epct-dark">{item.title}</p>
                            {item.excerpt ? (
                              <p className="text-sm leading-relaxed text-epct-ink/72">{item.excerpt}</p>
                            ) : null}
                            <div>
                              <Link
                                href={`/blog/${item.slug}`}
                                className="inline-flex min-h-10 items-center justify-center bg-epct-green px-4 text-sm font-semibold text-white transition hover:brightness-95"
                              >
                                {copy.readArticle}
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </article>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
