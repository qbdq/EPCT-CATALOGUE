import configPromise from '@payload-config';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import type { ServerFunctionClient } from 'payload';
import { importMap } from './admin/importMap';
import '@payloadcms/next/css';

const serverFunction: ServerFunctionClient = async ({ args, name }) => {
  'use server';

  return handleServerFunctions({
    args,
    config: configPromise,
    importMap,
    name,
  });
};

export default function PayloadRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return RootLayout({
    children,
    config: configPromise,
    importMap,
    serverFunction,
  });
}
