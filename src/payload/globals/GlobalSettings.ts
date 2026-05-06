import type { GlobalConfig } from 'payload';

export const GlobalSettings: GlobalConfig = {
  slug: 'global-settings',
  label: 'Global settings',
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    { name: 'companyName', type: 'text', required: true, defaultValue: 'EPCT' },
    { name: 'phone', type: 'text', required: true, defaultValue: '+216 58 348 436' },
    { name: 'whatsappNumber', type: 'text', required: true, defaultValue: '+216 58 348 436' },
    { name: 'email', type: 'email', required: true, defaultValue: 'epctunisie@gmail.com' },
    { name: 'address', type: 'textarea', required: true },
    { name: 'facebook', type: 'text' },
    { name: 'tiktok', type: 'text' },
    { name: 'homepageHeroTitle', type: 'text', required: true, defaultValue: 'Pièces pour centrales & pompes à béton' },
    { name: 'homepageHeroSubtitle', type: 'text', defaultValue: 'Solutions robustes pour vos équipements béton' },
    { name: 'homepageIntroText', type: 'textarea' },
    { name: 'defaultSeoTitle', type: 'text' },
    { name: 'defaultSeoDescription', type: 'textarea' },
  ],
};

export default GlobalSettings;
