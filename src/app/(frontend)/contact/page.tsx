import { SiteShell } from '@/components/site/SiteShell';

export const metadata = {
  title: 'Contact | EPCT',
};

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="container py-12">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-epct-green">Contact</p>
        <h1 className="mt-2 font-display text-4xl uppercase text-epct-dark">Parlons de votre besoin</h1>

        <form className="mt-8 grid gap-4 rounded-md border border-epct-green/20 bg-white p-6 md:max-w-2xl">
          <input className="rounded border border-epct-green/20 px-3 py-2" placeholder="Nom" />
          <input className="rounded border border-epct-green/20 px-3 py-2" placeholder="Email" type="email" />
          <input className="rounded border border-epct-green/20 px-3 py-2" placeholder="Téléphone" />
          <textarea
            className="min-h-32 rounded border border-epct-green/20 px-3 py-2"
            placeholder="Message"
          />
          <button className="rounded bg-epct-green px-4 py-2 font-semibold text-white" type="button">
            Envoyer (phase UI)
          </button>
        </form>
      </main>
    </SiteShell>
  );
}
