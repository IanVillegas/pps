// Paso 6, Datos económicos / cuentas de ahorro (nodos Figma 43121:4102 y
// 43121:4067).
export interface SavingsAccountItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** "Numero de cuenta/titulo": texto libre, no solo digitos. */
  accountNumber: string;
  holderName: string;
  /** Valor del catalogo de relacion con la cuenta (D-09: sintetico). */
  relationship: string;
  /** Monto en digitos, sin separadores (ver utils/money.ts). */
  amount: string;
  /** Valor del catalogo de moneda: 'colones' o 'dolares'. */
  currency: string;
  /** Valor del catalogo de entidad financiera (D-09: sintetico). */
  entity: string;
}

/** Datos del formulario de una cuenta, sin el identificador. */
export type SavingsAccountItemData = Omit<SavingsAccountItem, 'id'>;

/** Valores del paso 6 dentro del borrador. */
export interface SavingsValues {
  accounts?: SavingsAccountItem[];
}

/**
 * Saldos por moneda que entrega el backend (D-10): el frontend solo los
 * muestra, sin convertir ni sumar entre monedas.
 */
export interface SavingsTotals {
  colones: number;
  dolares: number;
}
