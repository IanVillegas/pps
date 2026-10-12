'use client';

import { useEffect, useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import IncomeDialog from '@/components/Organisms/IncomeDialog/IncomeDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import { INCOME_TYPE_OPTIONS } from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  ExpenseItem,
  IncomeExpensesValues,
  IncomeItem,
  IncomeItemData,
} from '@/types/IncomeExpenses.types';
import { createId } from '@/utils/ids';
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

const incomeTypeLabel = (value: string) =>
  INCOME_TYPE_OPTIONS.find(option => option.value === value)?.label ?? value;

const INCOME_COLUMNS: RecordsTableColumn<IncomeItem>[] = [
  { key: 'type', header: 'Tipo', render: row => incomeTypeLabel(row.type) },
  { key: 'amount', header: 'Monto', render: row => formatAmount(row.amount) },
  {
    key: 'attachments',
    header: 'Archivos',
    render: row => `${row.attachments.length} archivo(s)`,
  },
];

interface IncomeDialogState {
  open: boolean;
  item?: IncomeItem;
}

/**
 * Paso 3, Ingresos y egresos (DEC-009A/C/D, nodo Figma 43121:5334). Las
 * cifras de planilla, los totales, el saldo mensual y las razones las calcula
 * el backend; aqui solo se muestran (D-10, ver FinancialSummaryService). Cada
 * alta/edicion/retiro se guarda en el borrador al instante (D-11).
 */
const IncomeExpenses = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const data = values as IncomeExpensesValues;
  const incomes = data.additionalIncomes ?? NO_INCOMES;
  const expenses = data.expenses ?? NO_EXPENSES;
  const { summary, status } = useFinancialSummary(incomes, expenses);
  const [incomeDialog, setIncomeDialog] = useState<IncomeDialogState>({
    open: false,
  });

  useEffect(() => {
    if (status === 'error') notify(TOAST_MESSAGES.requestFailed);
  }, [status, notify]);

  const setIncomes = (next: IncomeItem[]) =>
    onChange({ ...values, additionalIncomes: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeIncomeDialog = () =>
    setIncomeDialog(current => ({ ...current, open: false }));

  const handleSaveIncome = (income: IncomeItemData) => {
    if (incomeDialog.item) {
      const id = incomeDialog.item.id;
      setIncomes(
        incomes.map(item => (item.id === id ? { ...income, id } : item))
      );
    } else {
      setIncomes([...incomes, { ...income, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeIncomeDialog();
  };

  const handleDeleteIncome = (income: IncomeItem) => {
    setIncomes(incomes.filter(item => item.id !== income.id));
    notify(TOAST_MESSAGES.removed);
  };

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
        <RecordsTable
          caption="Ingresos adicionales"
          title="Ingresos adicionales"
          columns={INCOME_COLUMNS}
          rows={incomes}
          getRowLabel={income => `ingreso ${incomeTypeLabel(income.type)}`}
          onAdd={() => setIncomeDialog({ open: true })}
          onEdit={income => setIncomeDialog({ open: true, item: income })}
          onDelete={handleDeleteIncome}
        />
      </section>
      <IncomeDialog
        open={incomeDialog.open}
        item={incomeDialog.item}
        onSave={handleSaveIncome}
        onClose={closeIncomeDialog}
      />
    </div>
  );
};

export default IncomeExpenses;
