import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import UploadThumbnailCell from '../components/UploadThumbnailCell.tsx';

export const TruckCategories: CollectionConfig = {
  slug: 'truck-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt', 'image'],
    group: 'Catalogue',
    description: 'High-level machine families such as truck pumps, pump mixers, or stationary pumps.',
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
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Truck category name',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Short description',
            },
          ],
        },
        {
          label: 'Image',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Category image',
              admin: {
                components: {
                  Cell: UploadThumbnailCell as any,
                },
              },
            },
          ],
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

export default TruckCategories;
