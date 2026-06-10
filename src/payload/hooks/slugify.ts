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

  const localizedName =
    (data?.[`name_${locale}`] as string | undefined) ||
    (data?.name_fr as string | undefined) ||
    (data?.name as string | undefined);
  const localizedTitle =
    (data?.[`title_${locale}`] as string | undefined) ||
    (data?.title_fr as string | undefined) ||
    (data?.title as string | undefined);

  if (typeof value === 'string' && value.trim().length > 0) {
    return ensureLocaleSuffix(value, locale);
  }

  const source =
    localizedName ||
    localizedTitle ||
    (operation === 'update'
      ? (((originalDoc as { name_fr?: string; title_fr?: string; name?: string; title?: string })?.name_fr ??
          (originalDoc as { title_fr?: string })?.title_fr ??
          (originalDoc as { name?: string })?.name ??
          (originalDoc as { title?: string })?.title ??
          '') as string)
      : '');

  return ensureLocaleSuffix(source, locale);
};
