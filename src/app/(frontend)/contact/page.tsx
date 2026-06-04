import { SiteShell } from '@/components/site/SiteShell';
import { ContactPageClient } from '@/components/contact/ContactPageClient';

export const metadata = {
  title: 'Contact | EPCT',
};

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactPageClient />
    </SiteShell>
  );
}
