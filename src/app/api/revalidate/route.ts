import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { paths?: string[] };
  const paths = body.paths ?? ['/'];

  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ ok: true, revalidated: paths });
}
