'use client';

import { useEffect, useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/sad-aml-shared/components/Organisms/RecordsTable/RecordsTable';
import RetryNotice from '@/sad-aml-shared/components/Molecules/RetryNotice/RetryNotice';
import CurrentAccountDialog from '@/components/Organisms/CurrentAccountDialog/CurrentAccountDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import { catalogLabel } from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  CurrentAccountItem,
  CurrentAccountItemData,
  CurrentAccountsValues,
  GroupCurrentAccount,
} from '@/types/CurrentAccount.types';
import { createId } from '@/utils/ids';
import { useCurrentAccounts } from '@/utils/hooks/useCurrentAccounts';
import {
  formatAmount,
  formatCurrency,
} from '@/sad-aml-shared/utils/helpers/money';
import { useCatalogs } from '@/utils/hooks/useCatalog';
import styles from './CurrentAccounts.module.scss';

// Referencia estable: un `[]` nuevo en cada render dispararia de nuevo el
// pedido de saldos en useCurrentAccounts.
const NO_ACCOUNTS: CurrentAccountItem[] = [];

const GROUP_COLUMNS: RecordsTableColumn<GroupCurrentAccount>[] = [
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
  { key: 'balance', header: 'Monto', render: row => formatAmount(row.balance) },
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

const ADDED_COLUMNS: RecordsTableColumn<CurrentAccountItem>[] = [
  {
    key: 'entity',
    header: 'Entidad financiera',
    render: row => catalogLabel('financialEntities', row.entity),
  },
  {
    key: 'balance',
    header: 'Saldo actual',
    render: row => formatAmount(row.balance),
  },
  {
    key: 'currency',
    header: 'Moneda',
    render: row => catalogLabel('currencies', row.currency),
  },
];

interface DialogState {
  open: boolean;
  item?: CurrentAccountItem;
}

/**
 * Paso 7, Cuentas corrientes (DEC-013, nodo Figma 43121:3695). Arriba, las
 * cuentas de Grupo Mutual: las entrega el backend y la persona no las edita.
 * Debajo, las cuentas que agrega ("Indique los montos a la fecha"), con alta,
 * edicion y retiro; esa tabla puede quedar vacia sin bloquear el avance (D-16),
 * por eso el paso no define reglas de validacion. Cada cambio se guarda en el
 * borrador al instante (D-11) y los saldos por moneda los entrega el backend
 * (D-10, ver CurrentAccountsService).
 */
const CurrentAccounts = ({ values, onChange }: StepProps) => {
  // Vuelve a dibujar la tabla cuando llegan los catalogos del servidor.
  useCatalogs();
  const { notify } = useNotification();
  const accounts = (values as CurrentAccountsValues).accounts ?? NO_ACCOUNTS;
  const { groupAccounts, groupStatus, totals, totalsStatus, retry } =
    useCurrentAccounts(accounts);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const hasError = groupStatus === 'error' || totalsStatus === 'error';
  useEffect(() => {
    if (hasError) notify(TOAST_MESSAGES.requestFailed);
  }, [hasError, notify]);

  const setAccounts = (next: CurrentAccountItem[]) =>
    onChange({ ...values, accounts: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: CurrentAccountItemData) => {
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

  const handleDelete = (account: CurrentAccountItem) => {
    setAccounts(accounts.filter(item => item.id !== account.id));
    notify(TOAST_MESSAGES.removed);
  };

  // Mientras no llega la primera respuesta del backend no hay cifra que mostrar.
  const NO_FIGURE = '—';

  const groupEmptyText =
    groupStatus === 'loading'
      ? 'Cargando cuentas de Grupo Mutual…'
      : groupStatus === 'error'
        ? 'No se pudieron cargar las cuentas de Grupo Mutual'
        : 'No hay cuentas corrientes de Grupo Mutual';

  return (
    <div className={styles.currentAccounts}>
      <RecordsTable
        caption="Cuentas corrientes de Grupo Mutual"
        title="Cuentas corrientes de Grupo Mutual"
        columns={GROUP_COLUMNS}
        rows={groupAccounts ?? []}
        getRowLabel={account => `cuenta ${account.accountNumber}`}
        emptyText={groupEmptyText}
      />
      <RecordsTable
        caption="Montos a la fecha"
        title="Indique los montos a la fecha"
        columns={ADDED_COLUMNS}
        rows={accounts}
        getRowLabel={account =>
          `cuenta ${catalogLabel('financialEntities', account.entity)} ${catalogLabel('currencies', account.currency)}`
        }
        onAdd={() => setDialog({ open: true })}
        onEdit={account => setDialog({ open: true, item: account })}
        onDelete={handleDelete}
      />
      {hasError && (
        <RetryNotice
          message="No se pudieron cargar las cifras. Revise su conexión e inténtelo de nuevo."
          onRetry={retry}
        />
      )}
      <section aria-labelledby="current-accounts-totals-heading">
        <h3
          id="current-accounts-totals-heading"
          className={styles.currentAccounts__heading}
        >
          Saldos de cuentas corrientes
        </h3>
        <dl className={styles.currentAccounts__totals}>
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
      <CurrentAccountDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </div>
  );
};

export default CurrentAccounts;
