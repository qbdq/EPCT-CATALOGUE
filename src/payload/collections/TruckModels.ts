import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';
import UploadThumbnailCell from '../components/UploadThumbnailCell.tsx';

export const TruckModels: CollectionConfig = {
  slug: 'truck-models',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'truckCategory', 'active', 'image'],
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
              label: 'Model name',
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
              name: 'description',
              type: 'textarea',
              localized: true,
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
