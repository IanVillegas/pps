import { useSyncExternalStore } from 'react';
import {
  getFinalizationStatus,
  getServerFinalizationStatus,
  leaveOath,
  openOath,
  subscribeFinalization,
  submitDeclaration,
} from '@/services/FinalizationService';

/**
 * Lee el estado de la finalizacion de la declaracion y expone sus acciones.
 * Es independiente de `useDeclaration` y de `useConfidentialReport`.
 */
export const useFinalization = () => {
  const status = useSyncExternalStore(
    subscribeFinalization,
    getFinalizationStatus,
    getServerFinalizationStatus
  );
  return { status, openOath, leaveOath, submitDeclaration };
};
