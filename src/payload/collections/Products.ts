import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'reference', 'active', 'featured'],
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
    { name: 'name', type: 'text', required: true },
    slugField(),
    { name: 'reference', type: 'text', required: true, unique: true },
    { name: 'shortDescription', type: 'textarea', required: true },
    { name: 'fullDescription', type: 'richText' },
    {
      name: 'sizes',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'additionalInfo', type: 'richText' },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text', required: true },
      ],
    },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'catalogue', type: 'relationship', relationTo: 'catalogues' },
    { name: 'brand', type: 'relationship', relationTo: 'brands', required: true },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'active', type: 'checkbox', defaultValue: true },
    seoFields,
  ],
};

export default Products;
