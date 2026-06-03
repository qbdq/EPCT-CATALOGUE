import Image from 'next/image';
import { Globe2, Mail, MessageCircle, Music2 } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { SiteShell } from '@/components/site/SiteShell';

export const metadata = {
  title: 'Contact | EPCT',
};

export default function ContactPage() {
  return (
    <SiteShell>
      <main className="px-0 pb-14 pt-0 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">
                Contact
              </p>
              <h1 className="mt-2 font-display text-2xl uppercase text-epct-dark md:text-3xl">
                Envoyer une demande
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
                Devis, disponibilite, clarification technique ou support: indiquez votre besoin et
                nous revenons vers vous avec une reponse utile et exploitable.
              </p>
            </div>

            <div className="relative aspect-[16/8] overflow-hidden bg-neutral-100">
              <Image
                src="/img/contact_form_elite.jpg"
                alt="Equipement beton EPCT"
                width={1600}
                height={900}
                priority
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 42vw, 100vw"
              />
            </div>
          </section>

          <section className="border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8">
            <div className="mb-6 max-w-5xl">
              <p className="font-display text-2xl uppercase text-epct-dark">Formulaire de contact</p>
              <p className="mt-2 text-sm leading-relaxed text-epct-ink/68 md:text-base">
                Indiquez le motif de votre prise de contact et les informations utiles sur la
                machine, la piece ou la situation.
              </p>
            </div>

            <ContactForm />
          </section>

          <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8">
            <div>
              <p className="font-display text-3xl uppercase text-epct-dark md:text-4xl">
                Parlons de votre besoin terrain
              </p>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-epct-ink/72 md:text-[17px]">
                EPCT accompagne les demandes de pieces, de disponibilite, de devis et de support
                pour les pompes a beton, malaxeurs et equipements de centrale. Decrivez votre
                besoin et nous revenons vers vous avec une reponse exploitable.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/21658348436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-epct-dark px-4 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-white/10 text-epct-lime">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  WhatsApp
                </a>

                <a
                  href="mailto:epctunisie@gmail.com"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <Mail className="h-4 w-4" />
                  </span>
                  Email
                </a>

                <a
                  href="https://www.facebook.com/epct.tn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <Globe2 className="h-4 w-4" />
                  </span>
                  Facebook
                </a>

                <a
                  href="https://www.tiktok.com/@epct_tn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 border border-epct-ink/10 bg-white px-4 text-sm font-semibold text-epct-dark transition hover:border-epct-green hover:text-epct-green"
                >
                  <span className="flex h-8 w-8 items-center justify-center bg-epct-green/10 text-epct-green">
                    <Music2 className="h-4 w-4" />
                  </span>
                  TikTok
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
