// Paso 2 de la declaracion, Conformacion del nucleo familiar
export interface FamilyMember {
  /** Identificador estable de la fila */
  id: string;
  fullName: string;
  /** Edad en años cumplidos */
  age: string;
  /** Valor del catalogo de parentesco */
  relationship: string;
  /** Valor del catalogo de genero */
  gender: string;
  /** Fecha de nacimiento (YYYY-MM-DD) */
  birthDate: string;
}

/** Datos que captura el formulario; el id lo asigna quien guarda la fila */
export type FamilyMemberData = Omit<FamilyMember, 'id'>;

/** Valores del paso en el borrador; la tabla puede estar vacia */
export interface FamilyValues {
  members?: FamilyMember[];
}
