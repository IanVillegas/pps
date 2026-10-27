'use client';

import { useEffect, useState } from 'react';
import RetryNotice from '@/sad-aml-shared/components/Molecules/RetryNotice/RetryNotice';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/sad-aml-shared/components/Organisms/RecordsTable/RecordsTable';
import SavingsDialog from '@/components/Organisms/SavingsDialog/SavingsDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import { catalogLabel } from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  SavingsAccountItem,
  SavingsAccountItemData,
  SavingsValues,
} from '@/types/Savings.types';
import { createId } from '@/utils/ids';
import { useSavingsTotals } from '@/utils/hooks/useSavingsTotals';
import {
  formatAmount,
  formatCurrency,
} from '@/sad-aml-shared/utils/helpers/money';
import { useCatalogs } from '@/utils/hooks/useCatalog';
import styles from './Savings.module.scss';

// Referencia estable: un `[]` nuevo en cada render dispararia de nuevo el
// pedido de saldos en useSavingsTotals.
const NO_ACCOUNTS: SavingsAccountItem[] = [];

const COLUMNS: RecordsTableColumn<SavingsAccountItem>[] = [
  {
    key: 'accountNumber',
    header: 'Número de cuenta/título',
    render: row => row.accountNumber,
  },
  {
    key: 'holderName',
    header: 'Nombre de dueño de la cuenta',
    render: row => row.holderName,
  },
  {
    key: 'relationship',
    header: 'Parentesco con dueño de la cuenta',
    render: row => catalogLabel('accountRelationships', row.relationship),
  },
  { key: 'amount', header: 'Monto', render: row => formatAmount(row.amount) },
  {
    key: 'currency',
    header: 'Moneda',
    render: row => catalogLabel('currencies', row.currency),
  },
  {
    key: 'entity',
    header: 'Entidad',
    render: row => catalogLabel('financialEntities', row.entity),
  },
];

interface DialogState {
  open: boolean;
  item?: SavingsAccountItem;
}

/**
 * Paso 6, Datos económicos (DEC-012, nodo Figma 43121:4102): cuentas de
 * ahorro con alta, edicion y retiro. La tabla puede quedar vacia sin bloquear
 * el avance (D-16), por eso el paso no define reglas de validacion. Cada
 * cambio se guarda en el borrador al instante (D-11). Los saldos por moneda
 * los entrega el backend (D-10, ver SavingsTotalsService).
 */
const Savings = ({ values, onChange }: StepProps) => {
  // Vuelve a dibujar la tabla cuando llegan los catalogos del servidor.
  useCatalogs();
  const { notify } = useNotification();
  const accounts = (values as SavingsValues).accounts ?? NO_ACCOUNTS;
  const { totals, status, retry } = useSavingsTotals(accounts);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  useEffect(() => {
    if (status === 'error') notify(TOAST_MESSAGES.requestFailed);
  }, [status, notify]);

  const setAccounts = (next: SavingsAccountItem[]) =>
    onChange({ ...values, accounts: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: SavingsAccountItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setAccounts(
        accounts.map(account => (account.id === id ? { ...data, id } : account))
      );
    } else {
      setAccounts([...accounts, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (account: SavingsAccountItem) => {
    setAccounts(accounts.filter(item => item.id !== account.id));
    notify(TOAST_MESSAGES.removed);
  };

  // Mientras no llega la primera respuesta del backend no hay cifra que mostrar.
  const NO_FIGURE = '—';

  return (
    <div className={styles.savings}>
      <RecordsTable
        caption="Cuentas de ahorro"
        title="Indique las cuentas de ahorros en las cuales usted puede hacer movimientos"
        columns={COLUMNS}
        rows={accounts}
        getRowLabel={account => `cuenta ${account.accountNumber}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={account => setDialog({ open: true, item: account })}
        onDelete={handleDelete}
      />
      {status === 'error' && (
        <RetryNotice
          message="No se pudieron cargar las cifras. Revise su conexión e inténtelo de nuevo."
          onRetry={retry}
        />
      )}
      <section aria-labelledby="savings-totals-heading">
        <h3 id="savings-totals-heading" className={styles.savings__heading}>
          Saldos cuentas de ahorro
        </h3>
        <dl className={styles.savings__totals}>
          <div>
            <dt>Colones</dt>
            <dd>{totals ? formatCurrency(totals.colones) : NO_FIGURE}</dd>
          </div>
          <div>
            <dt>Dólares</dt>
            <dd>{totals ? formatCurrency(totals.dolares, '$') : NO_FIGURE}</dd>
          </div>
        </dl>
      </section>
      <SavingsDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </div>
  );
};

export default Savings;
