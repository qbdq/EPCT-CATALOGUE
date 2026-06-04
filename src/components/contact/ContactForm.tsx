'use client';

import { useEffect, useState } from 'react';
import { contactReasons } from '@/lib/contact-reasons';
import { useSiteLocale } from '@/components/site/LocaleProvider';

type FormState = {
  name: string;
  email: string;
  phone: string;
  address: string;
  reason: string;
  message: string;
  consent: boolean;
};

const initialState: FormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  reason: contactReasons[0]?.value ?? '',
  message: '',
  consent: false,
};

const textByLocale = {
  fr: {
    sending: 'Envoi en cours',
    sendingText: "Votre demande est en train d'etre transmise.",
    sent: 'Demande envoyee',
    redirecting: 'Redirection en cours...',
    fullName: 'Nom complet',
    yourName: 'Votre nom',
    phone: 'Telephone',
    address: 'Adresse',
    addressPlaceholder: 'Ville, zone ou adresse',
    reason: 'Motif de contact',
    attachment: 'Piece jointe',
    attachmentHelp: 'Piece jointe optionnelle, formats acceptes: JPEG, PNG ou PDF. Taille maximale 2 MB.',
    message: 'Votre message',
    messagePlaceholder: 'Precisez la machine, la piece recherchee, la reference ou le contexte de votre demande.',
    consentTitle: "J'ai compris et j'accepte",
    consentText:
      "En communiquant mes informations, je consens a etre recontacte par voie electronique ou telephonique et j'accepte que ces informations soient exploitees dans le cadre de ma demande et de la relation commerciale qui peut en decouler. Je pourrai faire modifier ou supprimer mes informations sur simple demande.",
    reset: 'Reinitialiser',
    submit: 'Envoyer la demande',
    submitting: 'Envoi en cours...',
  },
  en: {
    sending: 'Sending',
    sendingText: 'Your request is being transmitted.',
    sent: 'Request sent',
    redirecting: 'Redirecting...',
    fullName: 'Full name',
    yourName: 'Your name',
    phone: 'Phone',
    address: 'Address',
    addressPlaceholder: 'City, area or address',
    reason: 'Reason for contact',
    attachment: 'Attachment',
    attachmentHelp: 'Optional attachment, accepted formats: JPEG, PNG or PDF. Maximum size 2 MB.',
    message: 'Your message',
    messagePlaceholder: 'Specify the machine, requested part, reference or the context of your request.',
    consentTitle: 'I understand and agree',
    consentText:
      'By sharing my information, I agree to be contacted by email or phone and accept that this information may be used in connection with my request and any commercial relationship that may result from it. I may request correction or deletion of my information at any time.',
    reset: 'Reset',
    submit: 'Send request',
    submitting: 'Sending...',
  },
  ar: {
    sending: 'جار الارسال',
    sendingText: 'يتم الان ارسال طلبك.',
    sent: 'تم ارسال الطلب',
    redirecting: 'جار اعادة التوجيه...',
    fullName: 'الاسم الكامل',
    yourName: 'اسمك',
    phone: 'الهاتف',
    address: 'العنوان',
    addressPlaceholder: 'المدينة او المنطقة او العنوان',
    reason: 'سبب التواصل',
    attachment: 'مرفق',
    attachmentHelp: 'مرفق اختياري، الصيغ المقبولة: JPEG و PNG و PDF. الحجم الاقصى 2 MB.',
    message: 'رسالتك',
    messagePlaceholder: 'حدد الالة او القطعة المطلوبة او المرجع او سياق طلبك.',
    consentTitle: 'لقد فهمت ووافقت',
    consentText:
      'من خلال ارسال معلوماتي، اوافق على اعادة التواصل معي عبر البريد الالكتروني او الهاتف، كما اوافق على استخدام هذه المعلومات في اطار طلبي والعلاقة التجارية التي قد تنتج عنه. يمكنني طلب تعديل او حذف معلوماتي في اي وقت.',
    reset: 'اعادة التعيين',
    submit: 'ارسال الطلب',
    submitting: 'جار الارسال...',
  },
} as const;

export function ContactForm() {
  const { locale } = useSiteLocale();
  const text = textByLocale[locale];
  const [form, setForm] = useState<FormState>(initialState);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (status !== 'success') return;

    const timeout = window.setTimeout(() => {
      window.location.reload();
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const formData = new FormData();
      formData.set('name', form.name ?? '');
      formData.set('email', form.email ?? '');
      formData.set('phone', form.phone ?? '');
      formData.set('address', form.address ?? '');
      formData.set('reason', form.reason ?? '');
      formData.set('message', form.message ?? '');
      formData.set('consent', String(!!form.consent));
      if (attachment) formData.set('attachment', attachment);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const json = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            message?: string;
            error?: string;
            details?: {
              fieldErrors?: Record<string, string[] | undefined>;
              formErrors?: string[];
            };
          }
        | null;

      if (!response.ok || !json?.ok) {
        const fieldMessages = Object.values(json?.details?.fieldErrors ?? {})
          .flat()
          .filter((value): value is string => Boolean(value));
        const formMessages = (json?.details?.formErrors ?? []).filter(
          (value): value is string => Boolean(value),
        );
        const detailMessage = [...fieldMessages, ...formMessages].join(' ');

        throw new Error(detailMessage || json?.error || 'Une erreur est survenue.');
      }

      setStatus('success');
      setFeedback(json.message || 'Votre demande a bien ete envoyee.');
      setForm(initialState);
      setAttachment(null);
    } catch (error) {
      setStatus('error');
      setFeedback(error instanceof Error ? error.message : 'Envoi impossible pour le moment.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-5">
      {status === 'submitting' ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-epct-green/20 border-t-epct-green" />
            <div>
              <p className="font-display text-xl uppercase text-epct-dark">{text.sending}</p>
              <p className="mt-1 text-sm text-epct-ink/70">{text.sendingText}</p>
            </div>
          </div>
        </div>
      ) : null}

      {status === 'success' ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="flex animate-pulse flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-epct-green text-4xl text-white shadow-[0_14px_30px_rgba(12,122,89,0.24)]">
              ✓
            </div>
            <div>
              <p className="font-display text-2xl uppercase text-epct-dark">{text.sent}</p>
              <p className="mt-1 text-sm text-epct-ink/70">{text.redirecting}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 self-start">
          <span className="text-sm font-medium text-epct-dark">
            <span className="text-orange-500">*</span> {text.fullName}
          </span>
          <input
            required
            value={form.name ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="min-h-12 border border-epct-ink/15 bg-white px-4 text-epct-dark outline-none transition focus:border-epct-green"
            placeholder={text.yourName}
          />
        </label>

        <label className="grid gap-2 self-start">
          <span className="text-sm font-medium text-epct-dark">
            <span className="text-orange-500">*</span> Email
          </span>
          <input
            required
            type="email"
            value={form.email ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="min-h-12 border border-epct-ink/15 bg-white px-4 text-epct-dark outline-none transition focus:border-epct-green"
            placeholder="nom@entreprise.com"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 self-start">
          <span className="text-sm font-medium text-epct-dark">
            <span className="text-orange-500">*</span> {text.phone}
          </span>
          <input
            required
            value={form.phone ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            className="min-h-12 border border-epct-ink/15 bg-white px-4 text-epct-dark outline-none transition focus:border-epct-green"
            placeholder="+216 ..."
          />
        </label>

        <label className="grid gap-2 self-start">
          <span className="text-sm font-medium text-epct-dark">{text.address}</span>
          <input
            value={form.address ?? ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, address: event.target.value }))
            }
            className="min-h-12 border border-epct-ink/15 bg-white px-4 text-epct-dark outline-none transition focus:border-epct-green"
            placeholder={text.addressPlaceholder}
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-1">
        <label className="grid gap-2 self-start">
          <span className="text-sm font-medium text-epct-dark">{text.reason}</span>
          <select
            required
            value={form.reason ?? ''}
            onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
            className="min-h-12 border border-epct-ink/15 bg-white px-4 text-epct-dark outline-none transition focus:border-epct-green"
          >
            {contactReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-2 self-start">
        <span className="text-sm font-medium text-epct-dark">{text.attachment}</span>
        <input
          type="file"
          onChange={(event) => {
            const nextFile = event.target.files?.[0] ?? null;
            setAttachment(nextFile);
          }}
          className="min-h-12 border border-epct-ink/15 bg-white px-4 py-3 text-sm text-epct-dark outline-none transition file:mr-4 file:border-0 file:bg-epct-green/10 file:px-3 file:py-2 file:font-semibold file:text-epct-green focus:border-epct-green"
          accept=".pdf,.png,.jpg,.jpeg"
        />
        <p className="text-xs leading-relaxed text-epct-ink/60">{text.attachmentHelp}</p>
      </label>

      <label className="grid gap-2 self-start">
        <span className="text-sm font-medium text-epct-dark">
          <span className="text-orange-500">*</span> {text.message}
        </span>
        <textarea
          required
          value={form.message ?? ''}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="min-h-40 border border-epct-ink/15 bg-white px-4 py-3 text-epct-dark outline-none transition focus:border-epct-green"
          placeholder={text.messagePlaceholder}
        />
      </label>

      <label className="grid gap-3 border border-epct-ink/10 bg-white px-4 py-4">
        <div className="flex items-start gap-3">
          <input
            required
            type="checkbox"
            checked={!!form.consent}
            onChange={(event) =>
              setForm((current) => ({ ...current, consent: event.target.checked }))
            }
            className="mt-1 h-4 w-4 border border-epct-ink/20 accent-epct-green"
          />
          <div>
            <p className="font-medium text-epct-dark">{text.consentTitle}</p>
            <p className="mt-2 text-sm leading-relaxed text-epct-ink/68">{text.consentText}</p>
          </div>
        </div>
      </label>

      <div className="flex flex-col gap-3 border-t border-epct-ink/10 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => {
            setForm(initialState);
            setAttachment(null);
            setStatus('idle');
            setFeedback('');
          }}
          className="inline-flex min-h-14 items-center justify-center border border-epct-ink/15 bg-white px-6 text-sm font-semibold uppercase tracking-[0.08em] text-epct-dark transition hover:border-epct-red hover:text-epct-red"
        >
          {text.reset}
        </button>
        <button
          type="submit"
          disabled={status === 'submitting' || !form.consent}
          className="inline-flex min-h-14 items-center justify-center bg-epct-green px-8 text-base font-semibold uppercase tracking-[0.08em] text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? text.submitting : text.submit}
        </button>
      </div>

      {feedback ? (
        <div
          className={[
            'border px-4 py-3 text-sm',
            status === 'success'
              ? 'border-epct-green/25 bg-epct-green/5 text-epct-dark'
              : 'border border-red-300 bg-red-50 text-red-700',
          ].join(' ')}
        >
          {feedback}
        </div>
      ) : null}
    </form>
  );
}
