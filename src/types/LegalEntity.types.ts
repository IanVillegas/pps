// Paso 10, Personería jurídica (nodos Figma 43121:2464 y 43121:2440).
export interface LegalEntityItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Nombre de la personeria juridica. */
  name: string;
  /** "Cedula juridica": texto libre, sin formato validado (ver DEC-016A). */
  legalId: string;
  /** "Objetivo" de la personeria: texto libre. */
  purpose: string;
  /** "Plazo": texto libre; Figma no dice si es una duracion o una fecha. */
  term: string;
}

/** Datos del formulario de una personeria, sin el identificador. */
export type LegalEntityItemData = Omit<LegalEntityItem, 'id'>;

/** Valores del paso 10 dentro del borrador. */
export interface LegalEntitiesValues {
  legalEntities?: LegalEntityItem[];
}
