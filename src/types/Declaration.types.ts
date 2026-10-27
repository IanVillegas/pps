/** Valores capturados en un paso. Cada paso define sus propios campos. */
export type StepValues = Record<string, unknown>;

/** Mensaje de error por nombre de campo; vacio si el paso es valido. */
export type StepErrors = Record<string, string>;

export interface DeclarationDraft {
  /** El modal de introduccion ya se cerro con "Entendido" en esta sesion. */
  introAcknowledged: boolean;
  /** Valores por numero de paso; un paso sin entrada aun no se ha tocado. */
  steps: Record<number, StepValues>;
  /**
   * Veces que se intento salir del paso 1 sin completarlo. Hace que el paso 1
   * muestre sus errores aunque la persona no haya pulsado «Continuar» (por
   * ejemplo, tras intentar saltar a otro paso desde el stepper).
   */
  personalDataRequests: number;
}
