import { NextResponse } from 'next/server';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = ContactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: 'Message reçu (mode dev).' });
}
