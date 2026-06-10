import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import { resolveTranslatedFields } from '../hooks/resolveTranslatedFields.ts';
import UploadThumbnailCell from '../components/UploadThumbnailCell.tsx';

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Marque',
    plural: 'Marques',
  },
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'updatedAt', 'featuredImage'],
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
                {
                  name: 'name_fr',
                  type: 'text',
                  required: true,
                  label: 'Nom FR',
                  admin: { width: '33%' },
                },
                {
                  name: 'name_en',
                  type: 'text',
                  label: 'Nom EN',
                  admin: { width: '33%' },
                },
                {
                  name: 'name_ar',
                  type: 'text',
                  label: 'Nom AR',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'description_fr',
                  type: 'textarea',
                  label: 'Description FR',
                  admin: { width: '33%' },
                },
                {
                  name: 'description_en',
                  type: 'textarea',
                  label: 'Description EN',
                  admin: { width: '33%' },
                },
                {
                  name: 'description_ar',
                  type: 'textarea',
                  label: 'Description AR',
                  admin: { width: '33%' },
                },
              ],
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
