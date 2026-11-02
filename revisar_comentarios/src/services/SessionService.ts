// ! [SIMULADO] Sesion de demostracion en memoria. Reemplazar por el adaptador real o borrar al conectar el backend
import type { SessionUser } from '@/types/Session.types';
import { clearDraft } from '@/services/DeclarationService';
import { clearConfidentialAnswers } from '@/services/ConfidentialReportService';
import { clearFinalization } from '@/services/FinalizationService';

// Sesion de demostracion en memoria. No guarda credenciales ni autoriza APIs
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
  clearDraft();
  clearConfidentialAnswers();
  clearFinalization();
  listeners.forEach(listener => listener());
};
