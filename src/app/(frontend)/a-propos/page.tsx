import { SiteShell } from '@/components/site/SiteShell';
import { AboutPageClient } from '@/components/about/AboutPageClient';
import { getPublicAboutPage, getPublicGlobalSettings } from '@/lib/public-api';

export async function generateMetadata() {
  const aboutPage = await getPublicAboutPage();

  return {
    title: aboutPage?.seo?.title || 'A propos | EPCT Tunisie',
    description:
      aboutPage?.seo?.description ||
      'EPCT Tunisie accompagne les besoins en pompe a beton, malaxeur, pompe malaxeur, centrale a beton et pieces techniques pour les professionnels du beton en Tunisie.',
  };
}

export default async function AboutPage() {
  const [aboutPage, globalSettings] = await Promise.all([
    getPublicAboutPage(),
    getPublicGlobalSettings(),
  ]);

  return (
    <SiteShell>
      <AboutPageClient aboutPage={aboutPage} globalSettings={globalSettings} />
    </SiteShell>
  );
}
