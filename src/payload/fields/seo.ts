import type { Field } from 'payload';

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'SEO title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'SEO description',
      maxLength: 160,
    },
  ],
};
