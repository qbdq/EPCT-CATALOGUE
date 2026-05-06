import type { Access } from 'payload';

export const isAdmin: Access = ({ req }) => {
  const user = req.user as { role?: string } | null;
  return Boolean(user && user.role === 'admin');
};
