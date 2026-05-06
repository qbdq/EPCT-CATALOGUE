import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone', 'submittedAt', 'read'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'read', type: 'checkbox', defaultValue: false },
    { name: 'notes', type: 'textarea' },
    {
      name: 'submittedAt',
      type: 'date',
      admin: { readOnly: true },
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default ContactSubmissions;
