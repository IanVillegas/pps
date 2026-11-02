// Paso 6, Datos económicos / cuentas de ahorro
export interface SavingsAccountItem {
  /** Identificador estable de la fila (no depende de su posicion) */
  id: string;
  /** "Numero de cuenta/titulo": texto libre, no solo digitos */
  accountNumber: string;
  holderName: string;
  /** Valor del catalogo de relacion con la cuenta */
  relationship: string;
  /** Monto en digitos, sin separadores (ver utils/money.ts) */
  amount: string;
  /** Valor del catalogo de moneda: 'colones' o 'dolares' */
  currency: string;
  /** Valor del catalogo de entidad financiera */
  entity: string;
}

/** Datos del formulario de una cuenta, sin el identificador */
export type SavingsAccountItemData = Omit<SavingsAccountItem, 'id'>;

/** Valores del paso 6 dentro del borrador */
export interface SavingsValues {
  accounts?: SavingsAccountItem[];
}

export interface SavingsTotals {
  colones: number;
  dolares: number;
}
