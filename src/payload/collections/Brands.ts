import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import UploadThumbnailCell from '../components/UploadThumbnailCell.tsx';

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Brand',
    plural: 'Brands',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt', 'featuredImage'],
    group: 'Catalogue',
    description: 'Manufacturers referenced in the catalogue.',
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
              localized: true,
              label: 'Brand name',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
              label: 'Short description',
            },
            {
              name: 'badgeColor',
              type: 'text',
              label: 'Badge color',
              admin: {
                description: 'Use a HEX color like #15803d for catalogue badges.',
                placeholder: '#15803d',
              },
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Brand logo',
              admin: {
                components: {
                  Cell: UploadThumbnailCell as any,
                },
              },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Brand image',
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

export default Brands;
