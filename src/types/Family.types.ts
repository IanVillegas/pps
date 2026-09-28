// Paso 2 de la declaracion, Conformacion del nucleo familiar (nodos Figma
// 43121:5909 y 43121:6211). La edad y la fecha de nacimiento se capturan y
// guardan por separado: NO se valida que coincidan (D-19, abierto).
export interface FamilyMember {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  fullName: string;
  /** Edad en anos cumplidos, tal como la escribe la persona. */
  age: string;
  /** Valor del catalogo de parentesco. */
  relationship: string;
  /** Valor del catalogo de genero. */
  gender: string;
  /** Fecha de nacimiento en ISO (YYYY-MM-DD). */
  birthDate: string;
}

/** Datos del formulario de un familiar, sin el identificador. */
export type FamilyMemberData = Omit<FamilyMember, 'id'>;

/** Valores del paso 2 dentro del borrador. */
export interface FamilyValues {
  members?: FamilyMember[];
}
