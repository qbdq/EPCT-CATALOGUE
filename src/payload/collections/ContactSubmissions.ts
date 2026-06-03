import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { contactReasons } from '@/lib/contact-reasons';

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'reason', 'email', 'phone', 'address', 'attachment', 'submittedAt', 'read'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nom' },
    { name: 'email', type: 'email', required: true, label: 'Email' },
    { name: 'phone', type: 'text', required: true, label: 'Téléphone' },
    { name: 'address', type: 'text', label: 'Adresse' },
    {
      name: 'attachment',
      type: 'upload',
      relationTo: 'media',
      label: 'Pièce jointe',
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      label: 'Motif de contact',
      options: contactReasons.map((reason) => ({
        label: reason.label,
        value: reason.value,
      })),
    },
    { name: 'message', type: 'textarea', required: true, label: 'Message' },
    { name: 'read', type: 'checkbox', defaultValue: false, label: 'Lu' },
    {
      name: 'dismissed',
      type: 'checkbox',
      defaultValue: false,
      label: 'Notification masquee',
      admin: {
        position: 'sidebar',
        description: 'Retire cette demande de la vue notifications sans supprimer l enregistrement.',
      },
    },
    { name: 'notes', type: 'textarea', label: 'Notes internes' },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Date de soumission',
      admin: { readOnly: true },
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default ContactSubmissions;
