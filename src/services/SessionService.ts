// [SIMULADO] Sesion de demostracion en memoria. Reemplazar por el adaptador real o borrar al conectar el backend: ver src/services/README.md.
import type { SessionUser } from '@/types/Session.types';
import { clearConfidentialAnswers } from '@/services/ConfidentialReportService';
import { clearDraft } from '@/services/DeclarationService';
import { clearFinalization } from '@/services/FinalizationService';

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
  // El cuestionario confidencial es aun mas sensible: tampoco sobrevive.
  clearConfidentialAnswers();
  // Un guardado en curso o terminado tampoco debe pasar a la sesion siguiente.
  clearFinalization();
  listeners.forEach(listener => listener());
};
