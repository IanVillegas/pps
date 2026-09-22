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

/**
 * Guardia de ruta + shell para todas las pantallas internas: sin sesion
 * redirige a `/`; con sesion envuelve el contenido en AppShell y conecta
 * "Cerrar sesion". Lo usan los layouts de /inicio y /mi-declaracion.
 */
const AuthenticatedShell = ({ children }: { children: ReactNode }) => {
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
};

export default AuthenticatedShell;
