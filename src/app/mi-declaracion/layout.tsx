import type { ReactNode } from 'react';
import AuthenticatedShell from '@/components/Templates/AuthenticatedShell/AuthenticatedShell';

export default function MiDeclaracionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
