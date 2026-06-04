import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';
import { slugField } from '../fields/slug.ts';
import { seoFields } from '../fields/seo.ts';
import { onDocChange, onDocDelete } from '../hooks/revalidate.ts';

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  labels: {
    singular: 'Blog',
    plural: 'Blogs',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'featured', 'active'],
    description: 'Articles, conseils et actualites EPCT pour le secteur beton.',
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
          label: 'Contenu',
          fields: [
            { name: 'title', type: 'text', required: true, localized: true, label: "Titre de l'article" },
            slugField(),
            { name: 'author', type: 'text', required: true, localized: true, label: 'Auteur' },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Courte description',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
              label: 'Texte de l article',
            },
          ],
        },
        {
          label: 'Visuels',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Image principale du blog',
            },
            {
              name: 'coverImageTitle',
              type: 'text',
              localized: true,
              label: "Titre de l'image principale",
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Images liees au blog',
              labels: {
                singular: 'Image',
                plural: 'Images',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Image',
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  label: "Titre de l'image",
                },
              ],
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'tags',
              type: 'array',
              label: 'Tags',
              labels: {
                singular: 'Tag',
                plural: 'Tags',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Tag',
                },
              ],
            },
            {
              name: 'similarPosts',
              type: 'relationship',
              relationTo: 'blogs',
              hasMany: true,
              label: 'Articles similaires',
              filterOptions: ({ id }) => ({
                id: {
                  not_equals: id,
                },
              }),
            },
          ],
        },
        {
          label: 'Publication',
          fields: [
            {
              name: 'postType',
              type: 'select',
              required: true,
              label: 'Type de contenu',
              defaultValue: 'blog',
              options: [
                {
                  label: 'Blog',
                  value: 'blog',
                },
                {
                  label: 'Nouveaute',
                  value: 'nouveaute',
                },
              ],
            },
            {
              name: 'publishedAt',
              type: 'date',
              required: true,
              label: 'Date de publication',
              defaultValue: () => new Date().toISOString(),
            },
            { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Mis en avant' },
            { name: 'active', type: 'checkbox', defaultValue: true, label: 'Publie' },
          ],
        },
        {
          label: 'SEO',
          fields: [seoFields],
        },
      ],
    },
  ],
};

export default Blogs;
