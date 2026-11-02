// DEC-006B Acceso al borrador de la declaración.
import { useSyncExternalStore } from 'react';
import {
  acknowledgeIntro,
  getDraft,
  getServerDraft,
  saveStepValues,
  subscribeDraft,
} from '@/services/DeclarationService';

/** Lee el borrador de la declaracion y expone como actualizarlo. */
export const useDeclaration = () => {
  const draft = useSyncExternalStore(subscribeDraft, getDraft, getServerDraft);
  return { draft, saveStepValues, acknowledgeIntro };
};
