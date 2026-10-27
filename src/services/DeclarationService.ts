// [SIMULADO] Borrador de la declaracion en memoria, sin persistencia. Reemplazar por el adaptador real o borrar al conectar el backend: ver src/services/README.md.
import type { DeclarationDraft, StepValues } from '@/types/Declaration.types';

// Borrador de demostracion en memoria (datos sinteticos, sin contrato de
// backend todavia: D-08/D-09). Vive solo mientras la pestana no se recarga y
// se borra al cerrar sesion (ver SessionService.endSession); nunca se guarda
// patrimonio en localStorage. Al existir la API real, este modulo es el
// unico que cambia: mismo contrato, otro adaptador.
const EMPTY_DRAFT: DeclarationDraft = {
  introAcknowledged: false,
  steps: {},
  personalDataRequests: 0,
};

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

/**
 * Pide que el paso 1 muestre lo que le falta: se usa cuando alguien intenta ir
 * a otro paso sin haber completado los datos personales (unico paso que
 * bloquea el avance).
 */
export const requestPersonalData = () =>
  publish({ ...draft, personalDataRequests: draft.personalDataRequests + 1 });

export const clearDraft = () => publish(EMPTY_DRAFT);
