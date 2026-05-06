import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/epct-media/**',
      },
      {
        protocol: 'https',
        hostname: '**.epct.tn',
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
