import type { CollectionConfig } from 'payload';
import { isAdmin } from '../access/isAdmin.ts';
import { publicRead } from '../access/publicRead.ts';

const fallbackAltFromFilename = (filename?: string | null) => {
  if (!filename) return undefined;

  const baseName = filename.replace(/\.[^/.]+$/, '');
  const normalized = baseName.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

  return normalized || undefined;
};

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        if (!data) return data;

        const filename =
          typeof data.filename === 'string'
            ? data.filename
            : typeof req?.file?.name === 'string'
              ? req.file.name
              : undefined;

        if (!data.alt) {
          data.alt = fallbackAltFromFilename(filename) ?? 'Media upload';
        }

        return data;
      },
    ],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'media',
    focalPoint: false,
    mimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description:
          'Describe the image for accessibility and search engines. If left empty, it will be generated from the filename.',
      },
    },
  ],
};

export default Media;
