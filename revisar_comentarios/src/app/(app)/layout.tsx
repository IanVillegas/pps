import type { ReactNode } from 'react';
import AuthenticatedShell from '@/components/Templates/AuthenticatedShell/AuthenticatedShell';

export default function AppRouteGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
