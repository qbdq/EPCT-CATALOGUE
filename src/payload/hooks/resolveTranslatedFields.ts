import type { CollectionAfterReadHook } from 'payload';

type BaseField =
  | 'name'
  | 'description'
  | 'shortDescription'
  | 'fullDescription'
  | 'additionalInfo'
  | 'title'
  | 'excerpt'
  | 'author'
  | 'coverImageTitle';

const FALLBACK_ORDER = ['fr', 'en', 'ar'] as const;

function pickTranslatedValue(
  source: Record<string, unknown>,
  baseField: BaseField,
  locale: string,
) {
  const requestedKey = `${baseField}_${locale}`;
  const requestedValue = source[requestedKey];

  if (requestedValue !== undefined && requestedValue !== null && requestedValue !== '') {
    return requestedValue;
  }

  for (const fallbackLocale of FALLBACK_ORDER) {
    const fallbackKey = `${baseField}_${fallbackLocale}`;
    const fallbackValue = source[fallbackKey];

    if (fallbackValue !== undefined && fallbackValue !== null && fallbackValue !== '') {
      return fallbackValue;
    }
  }

  return source[baseField] ?? null;
}

export const resolveTranslatedFields =
  (fields: BaseField[]): CollectionAfterReadHook =>
  ({ doc, req }) => {
    if (!doc || typeof doc !== 'object') return doc;

    const locale = typeof req?.locale === 'string' ? req.locale : 'fr';
    const nextDoc = { ...doc } as Record<string, unknown>;

    for (const field of fields) {
      const frenchKey = `${field}_fr`;
      if (
        (nextDoc[frenchKey] === undefined || nextDoc[frenchKey] === null || nextDoc[frenchKey] === '') &&
        nextDoc[field] !== undefined &&
        nextDoc[field] !== null &&
        nextDoc[field] !== ''
      ) {
        nextDoc[frenchKey] = nextDoc[field];
      }

      nextDoc[field] = pickTranslatedValue(nextDoc, field, locale);
    }

    return nextDoc;
  };
