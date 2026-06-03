import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = (await request.json()) as {
    read?: boolean;
    dismissed?: boolean;
  };

  const payload = await getPayload({ config: await configPromise });
  const updated = await payload.update({
    collection: 'contact-submissions',
    id,
    data: {
      ...(typeof body.read === 'boolean' ? { read: body.read } : {}),
      ...(typeof body.dismissed === 'boolean' ? { dismissed: body.dismissed } : {}),
    },
  });

  return NextResponse.json(updated);
}
