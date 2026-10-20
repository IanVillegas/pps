// Paso 9, Tarjetas de crédito (nodos Figma 43121:2819 y 43121:2768).
export interface CreditCardItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** "Periodo": texto libre (Figma lo dibuja como campo de texto, ver DEC-015). */
  period: string;
  /** Valor del catalogo de entidad financiera (D-09: sintetico). */
  entity: string;
  /** Valor del catalogo de moneda de la tarjeta: 'colones' o 'dolares'. */
  currency: string;
  /** Fecha de vencimiento como YYYY-MM-DD. */
  expiryDate: string;
  /** Limite de la tarjeta en digitos, sin separadores (ver utils/money.ts). */
  limit: string;
  /** "Ultimos 4 # de operacion": cuatro digitos. */
  lastFour: string;
  /** Saldo en colones y en dolares (D-04): cada tarjeta puede tener ambos. */
  balanceColones: string;
  installmentColones: string;
  balanceDollars: string;
  installmentDollars: string;
}

/** Datos del formulario de una tarjeta, sin el identificador. */
export type CreditCardItemData = Omit<CreditCardItem, 'id'>;

/** Valores del paso 9 dentro del borrador. */
export interface CreditCardsValues {
  cards?: CreditCardItem[];
}

/** Totales de una moneda que entrega el backend. */
export interface CreditCardCurrencyTotals {
  /** Suma de saldos totales. */
  balance: number;
  /** Sumatoria de cuotas mensuales. */
  installments: number;
}

/**
 * Totales por moneda que entrega el backend (D-10): el frontend solo los
 * muestra, sin convertir ni sumar entre monedas.
 */
export interface CreditCardsTotals {
  colones: CreditCardCurrencyTotals;
  dolares: CreditCardCurrencyTotals;
}
