import type { FieldHook } from 'payload';

function normalize(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/\\s+/g, '-')
    .replace(/-+/g, '-');
}

function ensureLocaleSuffix(input: string, locale: string) {
  const base = normalize(input).replace(/-(fr|en|ar)$/i, '');
  return `${base}-${locale}`;
}

export const slugify: FieldHook = ({ value, data, originalDoc, operation, req }) => {
  const locale = typeof req?.locale === 'string' ? req.locale : 'fr';

  if (typeof value === 'string' && value.trim().length > 0) {
    return ensureLocaleSuffix(value, locale);
  }

  const source =
    (data?.name as string | undefined) ||
    (data?.title as string | undefined) ||
    (operation === 'update'
      ? (((originalDoc as { name?: string; title?: string })?.name ??
          (originalDoc as { title?: string })?.title ??
          '') as string)
      : '');

  return ensureLocaleSuffix(source, locale);
};
