'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/Templates/AppShell/AppShell';
import {
  getSession,
  getServerSession,
  subscribeSession,
  endSession,
} from '@/services/SessionService';

export default function InicioLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSyncExternalStore(
    subscribeSession,
    getSession,
    getServerSession
  );

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  if (!user) return null;

  return (
    <AppShell
      user={user}
      onLogout={() => {
        endSession();
        router.replace('/');
      }}
    >
      {children}
    </AppShell>
  );
}
