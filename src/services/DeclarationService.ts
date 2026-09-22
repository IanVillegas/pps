import type { DeclarationDraft, StepValues } from '@/types/Declaration.types';

// Borrador de demostracion en memoria (datos sinteticos, sin contrato de
// backend todavia: D-08/D-09). Vive solo mientras la pestana no se recarga y
// se borra al cerrar sesion (ver SessionService.endSession); nunca se guarda
// patrimonio en localStorage. Al existir la API real, este modulo es el
// unico que cambia: mismo contrato, otro adaptador.
const EMPTY_DRAFT: DeclarationDraft = { introAcknowledged: false, steps: {} };

let draft: DeclarationDraft = EMPTY_DRAFT;
const listeners = new Set<() => void>();

const publish = (next: DeclarationDraft) => {
  draft = next;
  listeners.forEach(listener => listener());
};

export const getDraft = () => draft;
export const getServerDraft = () => EMPTY_DRAFT;
export const subscribeDraft = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const saveStepValues = (stepId: number, values: StepValues) =>
  publish({ ...draft, steps: { ...draft.steps, [stepId]: values } });

export const acknowledgeIntro = () =>
  publish({ ...draft, introAcknowledged: true });

export const clearDraft = () => publish(EMPTY_DRAFT);
