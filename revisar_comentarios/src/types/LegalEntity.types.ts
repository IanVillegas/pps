// DEC-016A Personerías jurídicas y DEC-016B sociedades del paso 10.
// Paso 10, Personería jurídica
export interface LegalEntityItem {
  /** Identificador estable de la fila (no depende de su posicion) */
  id: string;
  /** Nombre de la personeria juridica */
  name: string;
  /** "Cedula juridica": texto libre, sin formato validado */
  legalId: string;
  /** "Objetivo" de la personeria: texto libre */
  purpose: string;
  /** "Plazo": un numero */
  term: string;
}

/** Datos del formulario de una personeria, sin el identificador */
export type LegalEntityItemData = Omit<LegalEntityItem, 'id'>;

/** Sociedad de la que la persona forma parte (tabla Si usted forma parte en alguna sociedad) */
export interface SocietyItem {
  /** Identificador estable de la fila (no depende de su posicion) */
  id: string;
  name: string;
  /** "Cedula juridica": texto libre, sin formato validado */
  legalId: string;
  /** Valor del catalogo de tipo de sociedad (D-09: provisional) */
  societyType: string;
  /** "Cargo en la sociedad": texto libre */
  role: string;
  /** "Plazo": un numero, sin unidad definida */
  term: string;
  /** Porcentaje de acciones o participacion: numero con punto decimal opcional, sin rango */
  sharePercent: string;
  /** Monto de dietas como texto decimal (5000.00); sin moneda definida */
  dietAmount: string;
  /** Tipo de poder del apoderado: texto libre. */
  powerType: string;
  /** Limite de suma del apoderado como texto decimal; sin moneda definida */
  sumLimit: string;
}

/** Datos del formulario de una sociedad, sin el identificador */
export type SocietyItemData = Omit<SocietyItem, 'id'>;

/** Valores del paso 10 dentro del borrador */
export interface LegalEntitiesValues {
  legalEntities?: LegalEntityItem[];
  societies?: SocietyItem[];
}
