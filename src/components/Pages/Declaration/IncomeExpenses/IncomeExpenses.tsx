'use client';

import { useEffect } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  ExpenseItem,
  IncomeExpensesValues,
  IncomeItem,
} from '@/types/IncomeExpenses.types';
import { useFinancialSummary } from '@/utils/hooks/useFinancialSummary';
import { formatAmount } from '@/utils/money';
import styles from './IncomeExpenses.module.scss';

// Referencias estables: un `[]` nuevo en cada render dispararia de nuevo el
// pedido del resumen en useFinancialSummary.
const NO_INCOMES: IncomeItem[] = [];
const NO_EXPENSES: ExpenseItem[] = [];

interface PayrollRow {
  id: string;
  label: string;
  amount: number;
}

const PAYROLL_COLUMNS: RecordsTableColumn<PayrollRow>[] = [
  { key: 'type', header: 'Tipo', render: row => row.label },
  { key: 'amount', header: 'Monto', render: row => formatAmount(row.amount) },
];

/**
 * Paso 3, Ingresos y egresos (DEC-009A/C/D, nodo Figma 43121:5334). Las
 * cifras de planilla, los totales, el saldo mensual y las razones las calcula
 * el backend; aqui solo se muestran (D-10, ver FinancialSummaryService).
 */
const IncomeExpenses = ({ values }: StepProps) => {
  const { notify } = useNotification();
  const data = values as IncomeExpensesValues;
  const incomes = data.additionalIncomes ?? NO_INCOMES;
  const expenses = data.expenses ?? NO_EXPENSES;
  const { summary, status } = useFinancialSummary(incomes, expenses);

  useEffect(() => {
    if (status === 'error') notify(TOAST_MESSAGES.requestFailed);
  }, [status, notify]);

  const payrollRows: PayrollRow[] = summary
    ? [
        { id: 'gross', label: 'Salario bruto', amount: summary.grossSalary },
        { id: 'net', label: 'Salario neto', amount: summary.netSalary },
      ]
    : [];

  return (
    <div className={styles.incomeExpenses}>
      <section className={styles.incomeExpenses__section}>
        <RecordsTable
          caption="Ingresos de planilla"
          title="Ingresos planilla"
          columns={PAYROLL_COLUMNS}
          rows={payrollRows}
          getRowLabel={row => row.label.toLowerCase()}
          emptyText={
            status === 'error'
              ? 'No se pudieron cargar los datos de planilla'
              : 'Cargando datos de planilla…'
          }
        />
      </section>
    </div>
  );
};

export default IncomeExpenses;
