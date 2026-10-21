// Paso 3, Ingresos y egresos (nodos Figma 43121:5334, 43121:5766 y
// 43121:5323).

/** Ingreso adicional al salario (modal «Ingresos adicionales»). */
export interface IncomeItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Valor del catalogo de tipo de ingreso (D-09: sintetico). */
  type: string;
  /** Monto en digitos, sin separadores (ver utils/money.ts). */
  amount: string;
  justification: string;
  /** Nombres de los PDF ya subidos; los archivos reales no van en el borrador. */
  attachments: string[];
}

export type IncomeItemData = Omit<IncomeItem, 'id'>;

/** Egreso mensual (modal «Egresos»). */
export interface ExpenseItem {
  id: string;
  /** Valor del catalogo de tipo de egreso (D-09: sintetico). */
  type: string;
  amount: string;
}

export type ExpenseItemData = Omit<ExpenseItem, 'id'>;

export type PatrimonialChanges = 'si' | 'no';
export type FinancialSituation = 'estable' | 'dificil' | 'grave';

/** Valores del paso 3 dentro del borrador. */
export interface IncomeExpensesValues {
  additionalIncomes?: IncomeItem[];
  expenses?: ExpenseItem[];
  patrimonialChanges?: PatrimonialChanges;
  /** Detalle de los cambios; solo existe mientras `patrimonialChanges` es «si». */
  patrimonialChangesDetail?: string;
  financialSituation?: FinancialSituation;
  situationDetail?: string;
}

/**
 * Cifras que el backend entrega para el paso 3. El frontend solo las muestra:
 * no define formulas, redondeo ni conversion de moneda (D-10).
 */
export interface FinancialSummary {
  grossSalary: number;
  netSalary: number;
  totalExpenses: number;
  /** Saldo mensual disponible, en colones. */
  monthlyBalance: number;
  /** Porcentaje (0-100) de egresos sobre ingresos. */
  expenseToIncomeRatio: number;
  /** Porcentaje (0-100) de cuotas de creditos sobre ingresos. */
  creditPaymentToIncomeRatio: number;
}
