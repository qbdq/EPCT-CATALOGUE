import { HomePageClient } from '@/components/home/HomePageClient';
import { SiteShell } from '@/components/site/SiteShell';

export default function HomePage() {
  return (
    <SiteShell>
      <HomePageClient />
    </SiteShell>
  );
}
