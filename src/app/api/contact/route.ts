import { NextResponse } from 'next/server';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { z } from 'zod';
import { contactReasons } from '@/lib/contact-reasons';

const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const contactReasonValues = contactReasons.map((reason) => reason.value) as [
  string,
  ...string[],
];

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caracteres.'),
  email: z.string().trim().email('Veuillez saisir un email valide.'),
  phone: z.string().trim().min(1, 'Le numero de telephone est requis.'),
  address: z.string().trim().optional(),
  reason: z.enum(contactReasonValues),
  message: z.string().trim().min(3, 'Veuillez saisir un message un peu plus precis.'),
  consent: z.boolean().refine((value) => value === true, {
    message: 'Le consentement est requis.',
  }),
});

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ ok: false, error: 'Requete invalide.' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse({
    name: getString(formData, 'name'),
    email: getString(formData, 'email'),
    phone: getString(formData, 'phone'),
    address: getString(formData, 'address'),
    reason: getString(formData, 'reason'),
    message: getString(formData, 'message'),
    consent: getString(formData, 'consent') === 'true',
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Invalid payload',
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const maybeAttachment = formData.get('attachment');
  const attachment =
    maybeAttachment instanceof File && maybeAttachment.size > 0 ? maybeAttachment : null;

  if (attachment && attachment.size > MAX_ATTACHMENT_SIZE) {
    return NextResponse.json(
      {
        ok: false,
        error: 'La pièce jointe depasse la taille maximale de 2 MB.',
      },
      { status: 400 },
    );
  }

  if (attachment && !ALLOWED_ATTACHMENT_TYPES.includes(attachment.type)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Formats acceptés: JPEG, PNG ou PDF uniquement.',
      },
      { status: 400 },
    );
  }

  const payload = await getPayload({ config: await configPromise });

  let attachmentDoc: { id: string | number } | null = null;

  if (attachment) {
    const attachmentBuffer = Buffer.from(await attachment.arrayBuffer());

    attachmentDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `Piece jointe contact - ${parsed.data.name}`,
      },
      file: {
        data: attachmentBuffer,
        mimetype: attachment.type || 'application/octet-stream',
        name: attachment.name,
        size: attachment.size,
      } as any,
    });
  }

  await payload.create({
    collection: 'contact-submissions',
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      address: parsed.data.address || undefined,
      reason: parsed.data.reason,
      message: parsed.data.message,
      attachment: attachmentDoc?.id,
    },
  });

  return NextResponse.json({
    ok: true,
    message: 'Votre demande a bien ete envoyee. Nous revenons vers vous rapidement.',
  });
}
