// Paso 8, Créditos que posee (nodos Figma 43121:3274 y 43121:3231).
export interface CreditItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Valor del catalogo de entidad financiera (D-09: sintetico). */
  entity: string;
  /** "Tipo de prestamo" en el modal y "Tipo de credito" en la tabla: texto libre. */
  loanType: string;
  /** Monto inicial en digitos, sin separadores (ver utils/money.ts). */
  initialAmount: string;
  /** Saldo actual ("Saldo a la fecha" en la tabla), en digitos. */
  currentBalance: string;
  /** Monto de la cuota mensual, en digitos. */
  installment: string;
  /** "Numero de prestamo" en el modal y "Operacion" en la tabla: texto libre. */
  loanNumber: string;
  /** Valor del catalogo de moneda: 'colones' o 'dolares'. */
  currency: string;
  /** Fecha de conclusion como YYYY-MM-DD. */
  endDate: string;
}

/** Datos del formulario de un credito, sin el identificador. */
export type CreditItemData = Omit<CreditItem, 'id'>;

/** Valores del paso 8 dentro del borrador. */
export interface CreditsValues {
  credits?: CreditItem[];
}

/** Totales de una moneda que entrega el backend. */
export interface CreditCurrencyTotals {
  /** Suma de saldos totales. */
  balance: number;
  /** Sumatoria de cuotas mensuales. */
  installments: number;
}

/**
 * Totales por moneda que entrega el backend (D-10): el frontend solo los
 * muestra, sin convertir ni sumar entre monedas.
 */
export interface CreditsTotals {
  colones: CreditCurrencyTotals;
  dolares: CreditCurrencyTotals;
}
