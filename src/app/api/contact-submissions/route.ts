import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload, type Where } from 'payload';

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config: await configPromise });
  const searchParams = request.nextUrl.searchParams;
  const limit = Number(searchParams.get('limit') ?? '20');
  const sort = searchParams.get('sort') ?? '-submittedAt';
  const depth = Number(searchParams.get('depth') ?? '0');
  const includeDismissed = searchParams.get('includeDismissed') === 'true';
  const readFilter = searchParams.get('read');

  const where: Where = {};

  if (!includeDismissed) {
    where.dismissed = {
      not_equals: true,
    };
  }

  if (readFilter === 'true' || readFilter === 'false') {
    where.read = {
      equals: readFilter === 'true',
    };
  }

  const submissions = await payload.find({
    collection: 'contact-submissions',
    depth,
    limit,
    sort,
    where,
  });

  return NextResponse.json(submissions);
}
