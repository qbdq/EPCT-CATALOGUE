import type { GlobalConfig } from 'payload';
import { seoFields } from '../fields/seo.ts';

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'Parametres du site',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Image titre',
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie de realisations',
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titre',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
    seoFields,
  ],
};

export default AboutPage;
