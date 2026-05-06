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
    { name: 'description', type: 'textarea' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true },
    seoFields,
  ],
};

export default Catalogues;
