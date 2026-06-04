import type { GlobalConfig } from 'payload';

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  label: 'Global settings',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    { name: 'companyName', type: 'text', required: true, localized: true, defaultValue: 'EPCT' },
    { name: 'phone', type: 'text', required: true, defaultValue: '+216 58 348 436' },
    { name: 'whatsappNumber', type: 'text', required: true, defaultValue: '+216 58 348 436' },
    { name: 'email', type: 'email', required: true, defaultValue: 'epctunisie@gmail.com' },
    { name: 'address', type: 'textarea', required: true, localized: true },
    { name: 'facebook', type: 'text' },
    { name: 'tiktok', type: 'text' },
    {
      name: 'homepageHeroTitle',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Pieces pour centrales & pompes a beton',
    },
    {
      name: 'homepageHeroSubtitle',
      type: 'text',
      localized: true,
      defaultValue: 'Solutions robustes pour vos equipements beton',
    },
    { name: 'homepageIntroText', type: 'textarea', localized: true },
    {
      name: 'cataloguePDFs',
      type: 'array',
      label: 'Catalogues PDF',
      labels: {
        singular: 'Catalogue PDF',
        plural: 'Catalogues PDF',
      },
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Fichier PDF',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titre',
        },
      ],
    },
    { name: 'defaultSeoTitle', type: 'text', localized: true },
    { name: 'defaultSeoDescription', type: 'textarea', localized: true },
  ],
};

export default GlobalSettings;
