import type { Field } from 'payload';
import { slugify } from '../hooks/slugify.ts';

type SlugFieldOptions = {
  localized?: boolean;
  description?: string;
};

export const slugField = (label = 'Slug', options: SlugFieldOptions = {}): Field => ({
  name: 'slug',
  type: 'text',
  label,
  required: true,
  localized: options.localized ?? true,
  unique: true,
  index: true,
  hooks: {
    beforeValidate: [slugify],
  },
  admin: {
    position: 'sidebar',
    description:
      options.description ||
      'Generated automatically from the localized name or title, with the locale suffix added at the end.',
  },
});
