// Paso 7, Cuentas corrientes (nodos Figma 43121:3695 y 43121:3674).

/** Cuenta corriente que la persona agrega (modal «Datos económicos»). */
export interface CurrentAccountItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Valor del catalogo de entidad financiera (D-09: sintetico). */
  entity: string;
  /** Saldo actual en digitos, sin separadores (ver utils/money.ts). */
  balance: string;
  /** Valor del catalogo de moneda: 'colones' o 'dolares'. */
  currency: string;
}

/** Datos del formulario de una cuenta, sin el identificador. */
export type CurrentAccountItemData = Omit<CurrentAccountItem, 'id'>;

/** Valores del paso 7 dentro del borrador. */
export interface CurrentAccountsValues {
  accounts?: CurrentAccountItem[];
}

/**
 * Cuenta corriente de Grupo Mutual: la entrega el backend y la persona no la
 * edita (Figma, nodo 43121:4009: la tabla no tiene acciones).
 */
export interface GroupCurrentAccount {
  id: string;
  accountNumber: string;
  holderName: string;
  relationship: string;
  balance: number;
  currency: string;
  entity: string;
}

/**
 * Saldos por moneda que entrega el backend (D-10): el frontend solo los
 * muestra, sin convertir ni sumar entre monedas.
 */
export interface CurrentAccountTotals {
  colones: number;
  dolares: number;
}
