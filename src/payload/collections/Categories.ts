import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import { resolveTranslatedFields } from '../hooks/resolveTranslatedFields.ts';

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categorie',
    plural: 'Categories',
  },
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'order'],
    group: 'Catalogue',
    description: 'Product categories used to classify spare parts and catalogue items.',
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterRead: [resolveTranslatedFields(['name', 'description'])],
    afterChange: [onDocChange],
    afterDelete: [onDocDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Main info',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name_fr', type: 'text', required: true, label: 'Nom FR', admin: { width: '33%' } },
                { name: 'name_en', type: 'text', label: 'Nom EN', admin: { width: '33%' } },
                { name: 'name_ar', type: 'text', label: 'Nom AR', admin: { width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'description_fr', type: 'textarea', label: 'Description FR', admin: { width: '33%' } },
                { name: 'description_en', type: 'textarea', label: 'Description EN', admin: { width: '33%' } },
                { name: 'description_ar', type: 'textarea', label: 'Description AR', admin: { width: '33%' } },
              ],
            },
            {
              name: 'order',
              type: 'number',
              defaultValue: 0,
              label: 'Display order',
              admin: {
                description: 'Lower numbers appear first.',
              },
            },
          ],
        },
        {
          label: 'Image',
          fields: [{ name: 'icon', type: 'upload', relationTo: 'media', label: 'Category image' }],
        },
        {
          label: 'SEO',
          fields: [seoFields],
        },
      ],
    },
    slugField(),
  ],
};

export default Categories;
