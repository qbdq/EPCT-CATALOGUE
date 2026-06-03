import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'order'],
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
            { name: 'name', type: 'text', required: true, label: 'Category name' },
            { name: 'description', type: 'textarea', label: 'Short description' },
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
