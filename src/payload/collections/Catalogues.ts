import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';

export const Catalogues: CollectionConfig = {
  slug: 'catalogues',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'active', 'order'],
    group: 'Catalogue',
    description: 'Optional catalogue groupings used to organize downloadable or thematic product sets.',
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
            { name: 'name', type: 'text', required: true, label: 'Catalogue name' },
            { name: 'description', type: 'textarea', label: 'Short description' },
            {
              type: 'row',
              fields: [
                {
                  name: 'order',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Display order',
                  admin: {
                    width: '50%',
                    description: 'Lower numbers appear first.',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Visible in catalogue',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Image',
          fields: [{ name: 'coverImage', type: 'upload', relationTo: 'media', label: 'Cover image' }],
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

export default Catalogues;
