import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import { resolveTranslatedFields } from '../hooks/resolveTranslatedFields.ts';
import UploadThumbnailCell from '../components/UploadThumbnailCell.tsx';

export const TruckModels: CollectionConfig = {
  slug: 'truck-models',
  labels: {
    singular: 'Modele de camion',
    plural: 'Modeles de camions',
  },
  admin: {
    useAsTitle: 'name_fr',
    defaultColumns: ['name_fr', 'brand', 'truckCategory', 'active', 'image'],
    group: 'Catalogue',
    description: 'Specific machine models that belong to one brand and one truck category.',
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
                  name: 'brand',
                  label: 'Brand',
                  type: 'relationship',
                  relationTo: 'brands',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'truckCategory',
                  label: 'Truck category',
                  type: 'relationship',
                  relationTo: 'truck-categories',
                  required: true,
                  admin: {
                    width: '50%',
                  },
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
          ],
        },
        {
          label: 'Image',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Model image',
              admin: {
                components: {
                  Cell: UploadThumbnailCell as any,
                },
              },
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              name: 'active',
              type: 'checkbox',
              defaultValue: true,
              label: 'Visible in catalogue',
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

export default TruckModels;
