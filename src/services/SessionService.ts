import type { SessionUser } from '@/types/Session.types';
import { clearDraft } from '@/services/DeclarationService';

// Sesion de demostracion en memoria. No guarda credenciales ni autoriza APIs.
// Recargar la pagina termina la sesion hasta integrar el backend (D-08).
let session: SessionUser | null = null;
const listeners = new Set<() => void>();

export const getSession = () => session;
export const getServerSession = () => null;
export const subscribeSession = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const startMockSession = (username: string) => {
  session = { username, displayName: username };
  listeners.forEach(listener => listener());
};
export const endSession = () => {
  session = null;
  // El borrador es patrimonio de quien inicio sesion: no debe sobrevivir a
  // un cierre de sesion en un equipo compartido.
  clearDraft();
  listeners.forEach(listener => listener());
};
