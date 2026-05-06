import type { FieldHook } from 'payload';

export const slugify: FieldHook = ({ value, data, originalDoc, operation }) => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const source =
    (data?.name as string | undefined) ||
    (data?.title as string | undefined) ||
    (operation === 'update' ? ((originalDoc as { name?: string })?.name ?? '') : '');

  return source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
