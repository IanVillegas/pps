'use client';

import { useEffect, useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import { CurrencyTotals } from '@/components/Molecules';
import CreditDialog from '@/components/Organisms/CreditDialog/CreditDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import {
  CURRENCY_OPTIONS,
  FINANCIAL_ENTITY_OPTIONS,
  type CatalogOption,
} from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  CreditItem,
  CreditItemData,
  CreditsValues,
} from '@/types/Credit.types';
import { formatIsoDate } from '@/utils/dates';
import { createId } from '@/utils/ids';
import { useCreditsTotals } from '@/utils/hooks/useCreditsTotals';
import { formatAmount } from '@/utils/money';
import styles from './Credits.module.scss';

// Referencia estable: un `[]` nuevo en cada render dispararia de nuevo el
// pedido de totales en useCreditsTotals.
const NO_CREDITS: CreditItem[] = [];

const labelOf = (options: CatalogOption[], value: string) =>
  options.find(option => option.value === value)?.label ?? value;

const COLUMNS: RecordsTableColumn<CreditItem>[] = [
  {
    key: 'entity',
    header: 'Entidad',
    render: row => labelOf(FINANCIAL_ENTITY_OPTIONS, row.entity),
  },
  {
    key: 'initialAmount',
    header: 'Monto Inicial',
    render: row => formatAmount(row.initialAmount),
  },
  {
    key: 'currency',
    header: 'Moneda',
    render: row => labelOf(CURRENCY_OPTIONS, row.currency),
  },
  { key: 'loanType', header: 'Tipo de crédito', render: row => row.loanType },
  {
    key: 'currentBalance',
    header: 'Saldo a la fecha',
    render: row => formatAmount(row.currentBalance),
  },
  {
    key: 'installment',
    header: 'Monto cuota',
    render: row => formatAmount(row.installment),
  },
  { key: 'loanNumber', header: 'Operación', render: row => row.loanNumber },
  {
    key: 'endDate',
    header: 'Fecha conclusión',
    render: row => formatIsoDate(row.endDate),
  },
];

interface DialogState {
  open: boolean;
  item?: CreditItem;
}

/**
 * Paso 8, Créditos que posee (DEC-014, nodo Figma 43121:3274). Tabla editable
 * de creditos (alta, edicion y retiro) y, debajo, «Saldo actual de créditos»
 * con los totales por moneda. La tabla puede quedar vacia sin bloquear el
 * avance (D-16), por eso el paso no define reglas de validacion. Cada cambio
 * se guarda en el borrador al instante (D-11) y los totales los entrega el
 * backend (D-10, ver CreditsTotalsService).
 */
const Credits = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const credits = (values as CreditsValues).credits ?? NO_CREDITS;
  const { totals, status } = useCreditsTotals(credits);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const hasError = status === 'error';
  useEffect(() => {
    if (hasError) notify(TOAST_MESSAGES.requestFailed);
  }, [hasError, notify]);

  const setCredits = (next: CreditItem[]) =>
    onChange({ ...values, credits: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: CreditItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setCredits(
        credits.map(credit => (credit.id === id ? { ...data, id } : credit))
      );
    } else {
      setCredits([...credits, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (credit: CreditItem) => {
    setCredits(credits.filter(item => item.id !== credit.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <div className={styles.credits}>
      <RecordsTable
        caption="Créditos que posee"
        title="Indique la información de sus créditos"
        columns={COLUMNS}
        rows={credits}
        getRowLabel={credit => `crédito ${credit.loanNumber}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={credit => setDialog({ open: true, item: credit })}
        onDelete={handleDelete}
      />
      <CurrencyTotals
        heading="Saldo actual de créditos"
        colonesTitle="Saldo total de créditos en colones"
        dolaresTitle="Saldo total de créditos en dólares"
        totals={totals}
      />
      <CreditDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </div>
  );
};

export default Credits;
