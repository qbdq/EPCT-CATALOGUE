import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Produit',
    plural: 'Produits',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'reference',
      'category',
      'brand',
      'truckCategory',
      'stockStatus',
      'active',
      'featured',
    ],
    group: 'Catalogue',
    description:
      'Create spare parts and connect them to the right product category, brand, truck category, and model.',
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
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Product name',
                  admin: {
                    width: '70%',
                  },
                },
                {
                  name: 'reference',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Reference',
                  admin: {
                    width: '30%',
                    description: 'Unique internal or supplier reference.',
                  },
                },
              ],
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Short description',
              admin: {
                description: 'Quick summary shown in cards and listings.',
              },
            },
            {
              name: 'fullDescription',
              type: 'richText',
              localized: true,
              label: 'Detailed description',
            },
            {
              name: 'additionalInfo',
              type: 'richText',
              localized: true,
              label: 'Additional information',
            },
          ],
        },
        {
          label: 'Classification',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'category',
                  label: 'Product category',
                  type: 'relationship',
                  relationTo: 'categories',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'stockStatus',
                  type: 'select',
                  required: true,
                  defaultValue: 'in-stock',
                  label: 'Availability',
                  admin: {
                    width: '50%',
                  },
                  options: [
                    {
                      label: 'En stock',
                      value: 'in-stock',
                    },
                    {
                      label: 'Rupture de stock',
                      value: 'out-of-stock',
                    },
                    {
                      label: 'Sur commande',
                      value: 'on-order',
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  type: 'relationship',
                  relationTo: 'brands',
                  hasMany: true,
                  label: 'Brand',
                  admin: {
                    width: '33%',
                    description: 'You can select one or more compatible brands.',
                  },
                },
                {
                  name: 'truckCategory',
                  label: 'Truck category',
                  type: 'relationship',
                  relationTo: 'truck-categories',
                  required: true,
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'truckModel',
                  label: 'Truck model',
                  type: 'relationship',
                  relationTo: 'truck-models',
                  hasMany: true,
                  admin: {
                    width: '34%',
                    description:
                      'Filtered automatically by the selected brand and truck category. You can select multiple models.',
                  },
                  filterOptions: ({ siblingData }) => {
                    const values = siblingData as {
                      brand?: string | string[];
                      truckCategory?: string;
                    };
                    const filters: Record<string, { equals?: string; in?: string[] }> = {};

                    if (Array.isArray(values?.brand) && values.brand.length > 0) {
                      filters.brand = { in: values.brand };
                    } else if (typeof values?.brand === 'string' && values.brand.length > 0) {
                      filters.brand = { equals: values.brand };
                    }

                    if (typeof values?.truckCategory === 'string' && values.truckCategory.length > 0) {
                      filters.truckCategory = { equals: values.truckCategory };
                    }

                    return filters;
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'images',
              type: 'array',
              label: 'Product images',
              minRows: 1,
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              admin: {
                description: 'Add at least one clear product image.',
              },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Image file' },
                {
                  name: 'alt',
                  type: 'text',
                  required: true,
                  label: 'Alt text',
                },
              ],
            },
          ],
        },
        {
          label: 'Specifications',
          fields: [
            {
              name: 'sizes',
              type: 'array',
              label: 'Specifications',
              labels: {
                singular: 'Specification',
                plural: 'Specifications',
              },
              admin: {
                initCollapsed: true,
                description: 'Use this for dimensions, diameters, or other key product values.',
              },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Label' },
                { name: 'value', type: 'text', required: true, label: 'Value' },
              ],
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Featured on the website',
                  admin: {
                    width: '50%',
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
          label: 'SEO',
          fields: [seoFields],
        },
      ],
    },
    slugField('Slug du produit'),
  ],
};

export default Products;
