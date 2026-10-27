'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/Templates/AppShell/AppShell';
import { setUnauthorizedHandler } from '@/services/api/apiClient';
import { loadCatalogs } from '@/services/CatalogService';
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

  // [INTEGRACION] Con sesion: se piden los catalogos (no hace nada en modo simulado) y una
  // respuesta 401 de la API, que significa sesion vencida, cierra la sesion
  // local; la guardia de arriba lleva entonces al acceso.
  const hasSession = Boolean(user);
  useEffect(() => {
    if (!hasSession) return;
    setUnauthorizedHandler(() => endSession());
    void loadCatalogs();
    return () => setUnauthorizedHandler(null);
  }, [hasSession]);

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
