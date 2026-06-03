import type { Field } from 'payload';
import { slugify } from '../hooks/slugify.ts';

export const slugField = (label = 'Slug'): Field => ({
  name: 'slug',
  type: 'text',
  label,
  required: true,
  unique: true,
  index: true,
  hooks: {
    beforeValidate: [slugify],
  },
  admin: {
    position: 'sidebar',
    description: 'Generated automatically from the name. You can adjust it only if needed.',
  },
});
