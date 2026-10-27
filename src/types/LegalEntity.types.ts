// Paso 10, Personería jurídica (nodos Figma 43121:2464 y 43121:2440) y
// sociedades (nodos 43121:2392 y 43306:2214).
export interface LegalEntityItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Nombre de la personeria juridica. */
  name: string;
  /** "Cedula juridica": texto libre, sin formato validado (ver DEC-016A). */
  legalId: string;
  /** "Objetivo" de la personeria: texto libre. */
  purpose: string;
  /** "Plazo": un numero (en el sistema original se ve, por ejemplo, 3); la unidad no esta definida. */
  term: string;
}

/** Datos del formulario de una personeria, sin el identificador. */
export type LegalEntityItemData = Omit<LegalEntityItem, 'id'>;

/** Sociedad de la que la persona forma parte (tabla «Si usted forma parte en alguna sociedad»). */
export interface SocietyItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  name: string;
  /** "Cedula juridica": texto libre, sin formato validado (D-21). */
  legalId: string;
  /** Valor del catalogo de tipo de sociedad (D-09: provisional). */
  societyType: string;
  /** "Cargo en la sociedad": texto libre. */
  role: string;
  /** "Plazo": un numero, sin unidad definida (D-21). */
  term: string;
  /** Porcentaje de acciones o participacion: numero con punto decimal opcional, sin rango (D-28). */
  sharePercent: string;
  /** Monto de dietas como texto decimal («5000.00»); sin moneda definida (D-28). */
  dietAmount: string;
  /** Tipo de poder del apoderado: texto libre. */
  powerType: string;
  /** Limite de suma del apoderado como texto decimal; sin moneda definida (D-28). */
  sumLimit: string;
}

/** Datos del formulario de una sociedad, sin el identificador. */
export type SocietyItemData = Omit<SocietyItem, 'id'>;

/** Valores del paso 10 dentro del borrador. */
export interface LegalEntitiesValues {
  legalEntities?: LegalEntityItem[];
  societies?: SocietyItem[];
}
