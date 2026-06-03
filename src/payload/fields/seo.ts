import type { Field } from 'payload';

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Optional search engine fields. Leave empty to use the default page content.',
  },
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
