'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Boxes, Factory, Headset, MapPinned, MapPlus, Truck } from 'lucide-react';
import { AboutGallery } from '@/components/about/AboutGallery';
import { useSiteLocale } from '@/components/site/LocaleProvider';
import type { PublicAboutPage, PublicGlobalSettings } from '@/lib/public-api';
import { getMediaUrl } from '@/lib/public-api';

type AboutPageClientProps = {
  aboutPage: PublicAboutPage | null;
  globalSettings: PublicGlobalSettings | null;
};

export function AboutPageClient({ aboutPage, globalSettings }: AboutPageClientProps) {
  const { locale } = useSiteLocale();

  const copy = {
    fr: {
      eyebrow: 'A propos',
      heroTitle: 'EPCT Tunisie, pieces et solutions pour le materiel beton',
      heroText:
        'EPCT Tunisie accompagne les professionnels du beton avec une logique simple: comprendre la machine, identifier la bonne reference et accelerer le traitement des demandes sur pompe a beton, malaxeur, centrale a beton, pompe malaxeur et equipements associes.',
      presenceTitle: 'Une presence utile pour le secteur beton en Tunisie',
      presenceText: [
        'EPCT developpe une offre orientee terrain pour les acteurs du beton en Tunisie: exploitation, maintenance, approvisionnement et suivi des equipements. Notre travail consiste a aider les clients a retrouver plus vite les pieces, references et compatibilites adaptees a leurs machines.',
        'La page catalogue, les parcours par marque, categorie et modele, ainsi que notre accompagnement direct ont ete concus pour repondre a des recherches concretes: pompe a beton Tunisie, malaxeur Tunisie, pompe malaxeur, centrale a beton Tunis ou demande de piece technique pour chantier.',
        'EPCT ne se positionne pas comme une simple vitrine. Nous cherchons a transformer une demande en reponse exploitable, avec un langage metier comprehensible et une lecture pratique des besoins des professionnels tunisiens du beton.',
      ],
      seoHighlights: [
        'Pieces pour pompe a beton en Tunisie',
        'References pour malaxeur et pompe malaxeur',
        'Solutions pour centrale a beton et equipements associes',
        'Accompagnement technique et commercial a Tunis et sur tout le territoire tunisien',
      ],
      mapTitle: 'Nous trouver en Tunisie',
      mapText:
        'Retrouvez EPCT pour vos besoins en pompe a beton, malaxeur, pompe malaxeur, centrale a beton et pieces techniques. Cette zone permet d integrer votre presence locale dans le parcours client et de renforcer la visibilite d EPCT en Tunisie et a Tunis.',
      address: 'Adresse',
      plusCode: 'Plus code',
      openMaps: 'Ouvrir sur Google Maps',
      domainsTitle: 'Domaines d intervention et mots cles metier',
      domainsText:
        'Notre positionnement couvre les besoins autour de la pompe a beton, du malaxeur, de la pompe malaxeur, de la centrale a beton, des pieces de remplacement, des references compatibles et de l accompagnement terrain pour les professionnels bases a Tunis et dans toute la Tunisie.',
      strengths: [
        {
          icon: Factory,
          title: 'Centrale a beton',
          text: 'Un positionnement construit autour des pieces, ensembles et besoins de maintenance pour centrale a beton en Tunisie.',
        },
        {
          icon: Truck,
          title: 'Pompe a beton',
          text: 'Une lecture operationnelle des demandes pour pompe a beton, camion pompe et equipements de mise en oeuvre du beton.',
        },
        {
          icon: Boxes,
          title: 'Malaxeur et pompe malaxeur',
          text: 'Une organisation catalogue qui aide a orienter les demandes sur malaxeur, pompe malaxeur et sous-ensembles compatibles.',
        },
        {
          icon: Headset,
          title: 'Support terrain tunisien',
          text: 'Une reponse rapide pour les exploitants, techniciens et responsables achats en Tunisie, a Tunis et sur les zones de chantier.',
        },
      ],
      galleryTitle: 'Galerie de realisations',
      emptyGallery:
        'Aucune image n est encore publiee dans la galerie. Vous pourrez la remplir depuis Payload dans la section A propos.',
      ctaTitle: "Besoin d'une piece, d'un devis ou d'une orientation rapide",
      ctaText:
        'Accedez au catalogue pour filtrer par marque, categorie et modele, ou envoyez votre demande a EPCT Tunisie pour un besoin sur pompe a beton, malaxeur, centrale a beton ou pompe malaxeur.',
      findParts: 'Trouvez vos pieces rapidement',
      contactUs: 'Nous contacter',
    },
    en: {
      eyebrow: 'About',
      heroTitle: 'EPCT Tunisia, parts and solutions for concrete equipment',
      heroText:
        'EPCT Tunisia supports concrete professionals with a simple logic: understand the machine, identify the right reference and speed up requests for concrete pumps, mixers, batching plants, pump mixers and related equipment.',
      presenceTitle: 'A useful presence for the concrete sector in Tunisia',
      presenceText: [
        'EPCT develops a field-oriented offer for concrete operators in Tunisia: operation, maintenance, procurement and equipment follow-up. Our role is to help clients find parts, references and compatibility faster.',
        'The catalogue page, the paths by brand, category and model, as well as our direct support, were designed to answer concrete searches such as concrete pump Tunisia, mixer Tunisia, pump mixer, batching plant Tunis or technical spare part requests for worksites.',
        'EPCT does not position itself as a simple showcase. We aim to turn a request into an actionable answer with understandable industry language and a practical reading of the needs of Tunisian concrete professionals.',
      ],
      seoHighlights: [
        'Concrete pump spare parts in Tunisia',
        'References for mixers and pump mixers',
        'Solutions for batching plants and related equipment',
        'Technical and commercial support in Tunis and across Tunisia',
      ],
      mapTitle: 'Find us in Tunisia',
      mapText:
        'Find EPCT for your needs in concrete pumps, mixers, pump mixers, batching plants and technical spare parts. This area strengthens local visibility for EPCT in Tunisia and Tunis.',
      address: 'Address',
      plusCode: 'Plus code',
      openMaps: 'Open in Google Maps',
      domainsTitle: 'Business scope and industry keywords',
      domainsText:
        'Our positioning covers needs around concrete pumps, mixers, pump mixers, batching plants, replacement parts, compatible references and field support for professionals based in Tunis and across Tunisia.',
      strengths: [
        {
          icon: Factory,
          title: 'Batching plant',
          text: 'A positioning built around parts, assemblies and maintenance needs for batching plants in Tunisia.',
        },
        {
          icon: Truck,
          title: 'Concrete pump',
          text: 'An operational reading of requests for concrete pumps, truck pumps and concrete handling equipment.',
        },
        {
          icon: Boxes,
          title: 'Mixer and pump mixer',
          text: 'A catalogue organization that helps orient requests for mixers, pump mixers and compatible sub-assemblies.',
        },
        {
          icon: Headset,
          title: 'Tunisian field support',
          text: 'A quick response for operators, technicians and buyers in Tunisia, Tunis and worksite areas.',
        },
      ],
      galleryTitle: 'Project gallery',
      emptyGallery:
        'No image has been published in the gallery yet. You will be able to fill it from Payload in the About section.',
      ctaTitle: 'Need a part, a quote or quick guidance',
      ctaText:
        'Access the catalogue to filter by brand, category and model, or send your request to EPCT Tunisia for a need related to concrete pumps, mixers, batching plants or pump mixers.',
      findParts: 'Find your parts quickly',
      contactUs: 'Contact us',
    },
    ar: {
      eyebrow: 'من نحن',
      heroTitle: 'EPCT تونس، قطع وحلول لمعدات الخرسانة',
      heroText:
        'ترافق EPCT تونس مهنيي الخرسانة بمنطق بسيط: فهم الالة، تحديد المرجع الصحيح، وتسريع معالجة الطلبات الخاصة بمضخات الخرسانة والخلاطات ومحطات الخرسانة والخلاطات المضخة والمعدات المرتبطة بها.',
      presenceTitle: 'حضور مفيد لقطاع الخرسانة في تونس',
      presenceText: [
        'تطور EPCT عرضا موجها للميدان لفائدة العاملين في قطاع الخرسانة في تونس: الاستغلال، الصيانة، التزويد ومتابعة المعدات. ويتمثل دورنا في مساعدة العملاء على العثور بسرعة اكبر على القطع والمراجع والتوافقات المناسبة.',
        'تم تصميم صفحة الكتالوج ومسارات البحث حسب العلامة والفئة والموديل، وكذلك الدعم المباشر، للاستجابة لعمليات بحث عملية مثل مضخة خرسانة تونس، خلاط تونس، خلاط مضخة، محطة خرسانة تونس او طلب قطعة تقنية للورشة.',
        'لا تتموضع EPCT كمجرد واجهة عرض. نحن نسعى لتحويل الطلب الى رد عملي قابل للاستغلال، بلغة مهنية مفهومة وقراءة عملية لحاجيات مهنيي الخرسانة في تونس.',
      ],
      seoHighlights: [
        'قطع مضخات الخرسانة في تونس',
        'مراجع للخلاطات والخلاطات المضخة',
        'حلول لمحطات الخرسانة والمعدات المرتبطة بها',
        'مرافقة تقنية وتجارية في تونس العاصمة وفي كامل البلاد',
      ],
      mapTitle: 'اعثر علينا في تونس',
      mapText:
        'اعثر على EPCT لاحتياجاتك في مضخات الخرسانة والخلاطات والخلاطات المضخة ومحطات الخرسانة والقطع التقنية. هذه المساحة تعزز الحضور المحلي ل EPCT في تونس وتونس العاصمة.',
      address: 'العنوان',
      plusCode: 'رمز الموقع',
      openMaps: 'افتح في خرائط غوغل',
      domainsTitle: 'مجالات التدخل والكلمات المفتاحية المهنية',
      domainsText:
        'يغطي تموقعنا الاحتياجات المتعلقة بمضخات الخرسانة والخلاطات والخلاطات المضخة ومحطات الخرسانة وقطع الغيار والمراجع المتوافقة والدعم الميداني للمهنيين في تونس العاصمة وفي كامل البلاد.',
      strengths: [
        {
          icon: Factory,
          title: 'محطة خرسانة',
          text: 'تموقع مبني حول القطع والتجميعات واحتياجات الصيانة الخاصة بمحطات الخرسانة في تونس.',
        },
        {
          icon: Truck,
          title: 'مضخة خرسانة',
          text: 'قراءة عملية للطلبات المتعلقة بمضخات الخرسانة وشاحنات الضخ ومعدات مناولة الخرسانة.',
        },
        {
          icon: Boxes,
          title: 'خلاط وخلاط مضخة',
          text: 'تنظيم للكتالوج يساعد على توجيه الطلبات الخاصة بالخلاطات والخلاطات المضخة والتجميعات المتوافقة.',
        },
        {
          icon: Headset,
          title: 'دعم ميداني تونسي',
          text: 'استجابة سريعة للمستغلين والتقنيين ومسؤولي الشراء في تونس وفي مناطق الورشات.',
        },
      ],
      galleryTitle: 'معرض الانجازات',
      emptyGallery:
        'لم يتم نشر اي صورة في المعرض بعد. يمكنك تعبئته من Payload في قسم من نحن.',
      ctaTitle: 'هل تحتاج الى قطعة او عرض سعر او توجيه سريع',
      ctaText:
        'ادخل الى الكتالوج للتصفية حسب العلامة والفئة والموديل، او ارسل طلبك الى EPCT تونس بخصوص مضخة خرسانة او خلاط او محطة خرسانة او خلاط مضخة.',
      findParts: 'اعثر على قطعك بسرعة',
      contactUs: 'اتصل بنا',
    },
  }[locale];

  const heroImageUrl = '/img/elite_logo_full.png';
  const gallery = aboutPage?.gallery ?? [];
  const galleryItems = gallery
    .map((item) => {
      const imageUrl = getMediaUrl(item.image);

      if (!imageUrl) return null;

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl,
      };
    })
    .filter(Boolean) as Array<{
      id?: string;
      title?: string;
      description?: string;
      imageUrl: string;
    }>;

  const companyAddress =
    globalSettings?.address?.trim() || '28 Avenue du 18 Janvier, ex rue 4883, Tunis 1095';
  const plusCode = 'Q487+FP Tunis';
  const mapEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.437644789842!2d10.113268566979375!3d36.766437771436955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd31f60eb23919%3A0x6b5504339ef2353d!2sEPCT!5e0!3m2!1sen!2stn!4v1780487591561!5m2!1sen!2stn';
  const googleMapsUrl = 'https://maps.app.goo.gl/kcXkirEEMZs3K4rb8';

  return (
    <main className="px-0 pb-14 pt-0 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-4 border border-t-0 border-epct-ink/10 bg-white px-5 py-4 md:px-8 md:py-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="font-display text-sm uppercase tracking-[0.18em] text-epct-green md:text-base">
              {copy.eyebrow}
            </p>
            <h1 className="mt-2 font-display text-2xl uppercase text-epct-dark md:text-3xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-epct-ink/75 md:text-[15px]">
              {copy.heroText}
            </p>
          </div>

          <div className="relative aspect-[16/9.6] overflow-hidden bg-neutral-100">
            <Image
              src={heroImageUrl}
              alt="EPCT Tunisie equipements et pieces beton"
              width={1600}
              height={900}
              priority
              className="h-full w-full object-fill"
              sizes="(min-width: 1024px) 42vw, 100vw"
            />
          </div>
        </section>

        <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
          <div>
            <p className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
              {copy.presenceTitle}
            </p>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-epct-ink/72 md:text-base">
              {copy.presenceText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.seoHighlights.map((item, index) => (
              <div
                key={item}
                className="grid min-h-[148px] gap-4 border border-epct-ink/10 bg-white px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center bg-epct-green text-base font-bold text-white">
                    0{index + 1}
                  </span>
                  <span className="mt-1 h-px flex-1 bg-epct-green/20" />
                </div>
                <p className="font-display text-lg uppercase leading-snug text-epct-dark md:text-xl">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-[#f8f8f6] px-5 py-6 md:px-8 md:py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="max-w-xl">
            <p className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
              {copy.mapTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-epct-ink/72 md:text-base">
              {copy.mapText}
            </p>

            <div className="mt-5 grid gap-3">
              <div className="flex items-start gap-3 border border-epct-ink/10 bg-white px-4 py-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center bg-epct-green text-white">
                  <MapPinned className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base uppercase text-epct-dark">{copy.address}</p>
                  <p className="mt-1 text-sm leading-relaxed text-epct-ink/72">{companyAddress}</p>
                  <p className="mt-2 text-sm leading-relaxed text-epct-ink/55">
                    {copy.plusCode}: {plusCode}
                  </p>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-epct-green px-5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                <MapPlus className="h-4 w-4" />
                {copy.openMaps}
              </a>
            </div>
          </div>

          <div className="overflow-hidden border border-epct-ink/10 bg-white">
            <div className="relative aspect-[16/10] w-full">
              <iframe
                src={mapEmbedUrl}
                title="Localisation EPCT Tunisie"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8">
          <div className="max-w-4xl">
            <p className="font-display text-2xl uppercase text-epct-dark md:text-3xl">
              {copy.domainsTitle}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-epct-ink/72 md:text-base">
              {copy.domainsText}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {copy.strengths.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-epct-ink/10 bg-[#f8f8f6] p-5">
                <span className="inline-flex h-11 w-11 items-center justify-center bg-epct-green text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-lg uppercase text-epct-dark">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-epct-ink/70">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-white px-5 py-6 md:px-8 md:py-8">
          <div className="max-w-4xl">
            <p className="font-display text-2xl uppercase text-epct-green md:text-3xl">
              {copy.galleryTitle}
            </p>
          </div>

          {galleryItems.length ? (
            <AboutGallery items={galleryItems} />
          ) : (
            <div className="flex min-h-[320px] items-center justify-center border border-dashed border-epct-green/35 bg-[#f8f8f6] px-6 text-center text-sm leading-relaxed text-epct-ink/68">
              {copy.emptyGallery}
            </div>
          )}
        </section>

        <section className="grid gap-6 border border-t-0 border-epct-ink/10 bg-epct-dark px-5 py-6 text-white md:px-8 md:py-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-3xl">
            <p className="font-display text-2xl uppercase md:text-3xl">{copy.ctaTitle}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/78 md:text-base">
              {copy.ctaText}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/marques"
              className="inline-flex min-h-12 items-center justify-center bg-epct-green px-5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              {copy.findParts}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copy.contactUs}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
