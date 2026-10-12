import type {
  ExpenseItem,
  FinancialSummary,
  IncomeItem,
} from '@/types/IncomeExpenses.types';

// SIMULACION de la respuesta del backend para el paso 3 (sin contrato todavia:
// D-08/D-09/D-10). El backend es quien calcula salario, totales, saldo y
// razones; el frontend solo muestra lo que devuelve. Este modulo hace de
// backend mientras tanto, y las formulas de abajo son PROVISIONALES, no reglas
// de negocio: al existir la API real, `fetchFinancialSummary` es lo unico que
// cambia (mismo contrato, otro adaptador), igual que AuthService/AttachmentService.
const DELAY_MS = 250;

// Datos de planilla sinteticos (D-09: origen de saldos sin definir).
const MOCK_PAYROLL = { grossSalary: 1_500_000, netSalary: 1_200_000 };

// Valor del catalogo de egresos que cuenta como "cuota de creditos" para la
// razon cuota-ingreso (el modal de egresos pide anotar ahi las cuotas de
// creditos de Grupo Mutual, nodo Figma 43121:5323).
const CREDIT_PAYMENT_EXPENSE_TYPE = 'cuotas-creditos';

export interface FinancialSummaryInput {
  additionalIncomes: Pick<IncomeItem, 'amount'>[];
  expenses: Pick<ExpenseItem, 'type' | 'amount'>[];
}

const sum = (amounts: string[]) =>
  amounts.reduce((total, amount) => total + Number(amount || 0), 0);

const percentage = (part: number, whole: number) =>
  whole > 0 ? Math.round((part / whole) * 10000) / 100 : 0;

export const fetchFinancialSummary = async (
  input: FinancialSummaryInput
): Promise<FinancialSummary> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));

  const additionalIncome = sum(input.additionalIncomes.map(i => i.amount));
  const totalExpenses = sum(input.expenses.map(e => e.amount));
  const creditPayments = sum(
    input.expenses
      .filter(e => e.type === CREDIT_PAYMENT_EXPENSE_TYPE)
      .map(e => e.amount)
  );
  const totalIncome = MOCK_PAYROLL.netSalary + additionalIncome;

  return {
    ...MOCK_PAYROLL,
    totalExpenses,
    monthlyBalance: totalIncome - totalExpenses,
    expenseToIncomeRatio: percentage(totalExpenses, totalIncome),
    creditPaymentToIncomeRatio: percentage(creditPayments, totalIncome),
  };
};
