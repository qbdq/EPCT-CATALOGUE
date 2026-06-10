import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';

import Users from './collections/Users.ts';
import Media from './collections/Media.ts';
import Categories from './collections/Categories.ts';
import Brands from './collections/Brands.ts';
import TruckCategories from './collections/TruckCategories.ts';
import Products from './collections/Products.ts';
import Blogs from './collections/Blogs.ts';
import ContactSubmissions from './collections/ContactSubmissions.ts';
import TruckModels from './collections/TruckModels.ts';
import GlobalSettings from './globals/GlobalSettings.ts';
import AboutPage from './globals/AboutPage.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const devDbUrl = 'postgresql://epct_user:epct_dev_pw@127.0.0.1:55432/epct_db';
const dbUrl =
  process.env.DATABASE_URI ||
  (process.env.NODE_ENV === 'development' ? devDbUrl : undefined);
const payloadSecret = process.env.PAYLOAD_SECRET;
const s3Endpoint = process.env.S3_ENDPOINT;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretKey = process.env.S3_SECRET_KEY;
const hasS3StorageConfig = Boolean(s3Endpoint && s3AccessKey && s3SecretKey);

if (!dbUrl) throw new Error('DATABASE_URI is required');
if (!payloadSecret) throw new Error('PAYLOAD_SECRET is required');

export default buildConfig({
  admin: {
    suppressHydrationWarning: true,
    user: Users.slug,
  },
  localization: {
    defaultLocale: 'fr',
    fallback: true,
    locales: [
      {
        code: 'fr',
        label: 'Francais',
      },
      {
        code: 'en',
        label: 'English',
      },
      {
        code: 'ar',
        label: 'العربية',
        rtl: true,
      },
    ],
  },
  secret: payloadSecret,
  db: postgresAdapter({
    pool: {
      connectionString: dbUrl,
    },
  }),
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Categories,
    Brands,
    TruckCategories,
    TruckModels,
    Products,
    Blogs,
    ContactSubmissions,
  ],
  globals: [GlobalSettings, AboutPage],
  plugins: hasS3StorageConfig
    ? [
        s3Storage({
          collections: {
            media: true,
          },
          bucket: process.env.S3_BUCKET || 'epct-media',
          config: {
            endpoint: s3Endpoint!,
            region: process.env.S3_REGION || 'us-east-1',
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
            credentials: {
              accessKeyId: s3AccessKey!,
              secretAccessKey: s3SecretKey!,
            },
          },
        }),
      ]
    : [],
  typescript: {
    outputFile: path.resolve(dirname, '../types/payload-types.ts'),
  },
});
