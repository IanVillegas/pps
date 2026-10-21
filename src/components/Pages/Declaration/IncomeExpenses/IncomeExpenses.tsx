'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/Atoms';
import { RadioGroup } from '@/components/Molecules';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import ExpenseDialog from '@/components/Organisms/ExpenseDialog/ExpenseDialog';
import IncomeDialog from '@/components/Organisms/IncomeDialog/IncomeDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import {
  EXPENSE_TYPE_OPTIONS,
  INCOME_TYPE_OPTIONS,
} from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type { StepErrors, StepValues } from '@/types/Declaration.types';
import type {
  ExpenseItem,
  ExpenseItemData,
  FinancialSituation,
  IncomeExpensesValues,
  IncomeItem,
  IncomeItemData,
  PatrimonialChanges,
} from '@/types/IncomeExpenses.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { createId } from '@/utils/ids';
import { useFinancialSummary } from '@/utils/hooks/useFinancialSummary';
import { formatAmount, formatCurrency, formatPercent } from '@/utils/money';
import styles from './IncomeExpenses.module.scss';

// Referencias estables: un `[]` nuevo en cada render dispararia de nuevo el
// pedido del resumen en useFinancialSummary.
const NO_INCOMES: IncomeItem[] = [];
const NO_EXPENSES: ExpenseItem[] = [];

const PATRIMONIAL_CHANGES_OPTIONS = [
  { value: 'si', label: 'Si' },
  { value: 'no', label: 'No' },
];
const FINANCIAL_SITUATION_OPTIONS = [
  { value: 'estable', label: 'Estable' },
  { value: 'dificil', label: 'Difícil' },
  { value: 'grave', label: 'Grave' },
];

/**
 * Valida el paso 3. Las tablas pueden quedar vacias (D-16); lo que se exige
 * son las dos preguntas de «Otros detalles». La descripcion no lleva
 * asterisco en Figma («cualquier aclaracion que estime conveniente»), asi
 * que es opcional.
 */
export const validateIncomeExpenses = (stepValues: StepValues): StepErrors => {
  const values = stepValues as IncomeExpensesValues;
  const errors: StepErrors = {};
  if (!values.patrimonialChanges) {
    errors.patrimonialChanges =
      'Indique si existen cambios en su situación patrimonial';
  }
  if (!values.financialSituation) {
    errors.financialSituation =
      'Seleccione cómo califica su situación financiera';
  }
  return errors;
};

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

const expenseTypeLabel = (value: string) =>
  EXPENSE_TYPE_OPTIONS.find(option => option.value === value)?.label ?? value;

const INCOME_COLUMNS: RecordsTableColumn<IncomeItem>[] = [
  { key: 'type', header: 'Tipo', render: row => incomeTypeLabel(row.type) },
  { key: 'amount', header: 'Monto', render: row => formatAmount(row.amount) },
  {
    key: 'attachments',
    header: 'Archivos',
    render: row => `${row.attachments.length} archivo(s)`,
  },
];

const EXPENSE_COLUMNS: RecordsTableColumn<ExpenseItem>[] = [
  { key: 'type', header: 'Tipo', render: row => expenseTypeLabel(row.type) },
  { key: 'amount', header: 'Monto', render: row => formatAmount(row.amount) },
];

interface DialogState<T> {
  open: boolean;
  item?: T;
}

/**
 * Paso 3, Ingresos y egresos (DEC-009A/C/D, nodo Figma 43121:5334). Las
 * cifras de planilla, los totales, el saldo mensual y las razones las calcula
 * el backend; aqui solo se muestran (D-10, ver FinancialSummaryService). Cada
 * alta/edicion/retiro se guarda en el borrador al instante (D-11).
 */
const IncomeExpenses = ({ values, errors, onChange, actions }: StepProps) => {
  const { notify } = useNotification();
  const data = values as IncomeExpensesValues;
  const incomes = data.additionalIncomes ?? NO_INCOMES;
  const expenses = data.expenses ?? NO_EXPENSES;
  const { summary, status } = useFinancialSummary(incomes, expenses);
  const [incomeDialog, setIncomeDialog] = useState<DialogState<IncomeItem>>({
    open: false,
  });
  const [expenseDialog, setExpenseDialog] = useState<DialogState<ExpenseItem>>({
    open: false,
  });

  useEffect(() => {
    if (status === 'error') notify(TOAST_MESSAGES.requestFailed);
  }, [status, notify]);

  const patch = (changes: Partial<IncomeExpensesValues>) =>
    onChange({ ...values, ...changes });

  // Cierran sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeIncomeDialog = () =>
    setIncomeDialog(current => ({ ...current, open: false }));
  const closeExpenseDialog = () =>
    setExpenseDialog(current => ({ ...current, open: false }));

  const handleSaveIncome = (income: IncomeItemData) => {
    if (incomeDialog.item) {
      const id = incomeDialog.item.id;
      patch({
        additionalIncomes: incomes.map(item =>
          item.id === id ? { ...income, id } : item
        ),
      });
    } else {
      patch({
        additionalIncomes: [...incomes, { ...income, id: createId() }],
      });
    }
    notify(TOAST_MESSAGES.saved);
    closeIncomeDialog();
  };

  const handleDeleteIncome = (income: IncomeItem) => {
    patch({ additionalIncomes: incomes.filter(item => item.id !== income.id) });
    notify(TOAST_MESSAGES.removed);
  };

  const handleSaveExpense = (expense: ExpenseItemData) => {
    if (expenseDialog.item) {
      const id = expenseDialog.item.id;
      patch({
        expenses: expenses.map(item =>
          item.id === id ? { ...expense, id } : item
        ),
      });
    } else {
      patch({ expenses: [...expenses, { ...expense, id: createId() }] });
    }
    notify(TOAST_MESSAGES.saved);
    closeExpenseDialog();
  };

  const handleDeleteExpense = (expense: ExpenseItem) => {
    patch({ expenses: expenses.filter(item => item.id !== expense.id) });
    notify(TOAST_MESSAGES.removed);
  };

  const payrollRows: PayrollRow[] = summary
    ? [
        { id: 'gross', label: 'Salario bruto', amount: summary.grossSalary },
        { id: 'net', label: 'Salario neto', amount: summary.netSalary },
      ]
    : [];

  // Mientras no llega la primera respuesta del backend no hay cifra que mostrar.
  const NO_FIGURE = '—';

  return (
    <div className={styles.incomeExpenses}>
      <section className={styles.incomeExpenses__card}>
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

      <section className={styles.incomeExpenses__card}>
        <RecordsTable
          caption="Egresos mensuales"
          title="Egresos mensuales"
          columns={EXPENSE_COLUMNS}
          rows={expenses}
          getRowLabel={expense => `egreso ${expenseTypeLabel(expense.type)}`}
          onAdd={() => setExpenseDialog({ open: true })}
          onEdit={expense => setExpenseDialog({ open: true, item: expense })}
          onDelete={handleDeleteExpense}
        />
        <p className={styles.incomeExpenses__total}>
          <span>Total de egresos</span>
          <strong>
            {summary ? formatAmount(summary.totalExpenses) : NO_FIGURE}
          </strong>
        </p>
      </section>

      <section className={styles.incomeExpenses__card}>
        <div>
          <h3 className={styles.incomeExpenses__heading}>Otros detalles</h3>
          <dl className={styles.incomeExpenses__figures}>
            <div>
              <dt>Saldo mensual disponible</dt>
              <dd>
                {summary ? formatCurrency(summary.monthlyBalance) : NO_FIGURE}
              </dd>
            </div>
            <div>
              <dt>Relación gasto - ingreso</dt>
              <dd>
                {summary
                  ? formatPercent(summary.expenseToIncomeRatio)
                  : NO_FIGURE}
              </dd>
            </div>
            <div>
              <dt>Relación cuota créditos - ingreso</dt>
              <dd>
                {summary
                  ? formatPercent(summary.creditPaymentToIncomeRatio)
                  : NO_FIGURE}
              </dd>
            </div>
          </dl>
        </div>
        <RadioGroup
          legend="¿Cómo califica su situación financiera?"
          options={FINANCIAL_SITUATION_OPTIONS}
          value={data.financialSituation}
          errors={errors.financialSituation}
          onChange={value =>
            patch({ financialSituation: value as FinancialSituation })
          }
        />
        <Textarea
          label="Agregue una descripción detallada justificando su situación actual y cualquier aclaración que estime conveniente indicar"
          placeholder="Escribe aquí"
          maxLength={FIELD_MAX_LENGTH.situationDetail}
          value={data.situationDetail ?? ''}
          onChange={event => patch({ situationDetail: event.target.value })}
        />
        <RadioGroup
          legend="¿Existen cambios en el periodo actual en su situación patrimonial?"
          options={PATRIMONIAL_CHANGES_OPTIONS}
          value={data.patrimonialChanges}
          errors={errors.patrimonialChanges}
          onChange={value => {
            // Con «No» el detalle se descarta: no debe quedar un texto que
            // contradiga la respuesta.
            if (value === 'no') {
              const next: StepValues = { ...values, patrimonialChanges: value };
              delete next.patrimonialChangesDetail;
              onChange(next);
            } else {
              patch({ patrimonialChanges: value as PatrimonialChanges });
            }
          }}
        />
        {/* Siempre visible: solo se puede escribir con la respuesta «Si» y
            queda deshabilitado (y vacio) con «No» o sin responder. */}
        <Textarea
          label="Detalle los cambios en su situación patrimonial"
          placeholder="Escribe aquí"
          maxLength={FIELD_MAX_LENGTH.patrimonialChangesDetail}
          disabled={data.patrimonialChanges !== 'si'}
          value={data.patrimonialChangesDetail ?? ''}
          onChange={event =>
            patch({ patrimonialChangesDetail: event.target.value })
          }
        />
        {actions}
      </section>

      <IncomeDialog
        open={incomeDialog.open}
        item={incomeDialog.item}
        onSave={handleSaveIncome}
        onClose={closeIncomeDialog}
      />
      <ExpenseDialog
        open={expenseDialog.open}
        item={expenseDialog.item}
        onSave={handleSaveExpense}
        onClose={closeExpenseDialog}
      />
    </div>
  );
};

export default IncomeExpenses;
