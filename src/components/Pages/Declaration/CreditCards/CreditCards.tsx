'use client';

import { useEffect, useState } from 'react';
import { CurrencyTotals } from '@/components/Molecules';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/sad-aml-shared/components/Organisms/RecordsTable/RecordsTable';
import RetryNotice from '@/sad-aml-shared/components/Molecules/RetryNotice/RetryNotice';
import CreditCardDialog from '@/components/Organisms/CreditCardDialog/CreditCardDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import { catalogLabel } from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  CreditCardItem,
  CreditCardItemData,
  CreditCardsValues,
} from '@/types/CreditCard.types';
import { formatIsoDate } from '@/utils/dates';
import { createId } from '@/utils/ids';
import { useCreditCardsTotals } from '@/utils/hooks/useCreditCardsTotals';
import { formatAmount } from '@/sad-aml-shared/utils/helpers/money';
import { useCatalogs } from '@/utils/hooks/useCatalog';
import styles from './CreditCards.module.scss';

// Referencia estable: un `[]` nuevo en cada render dispararia de nuevo el
// pedido de totales en useCreditCardsTotals.
const NO_CARDS: CreditCardItem[] = [];

// Mismo orden que Figma (nodo 43121:2819).
const COLUMNS: RecordsTableColumn<CreditCardItem>[] = [
  { key: 'period', header: 'Periodo', render: row => row.period },
  {
    key: 'entity',
    header: 'Entidad',
    render: row => catalogLabel('financialEntities', row.entity),
  },
  {
    key: 'expiryDate',
    header: 'Fecha vencimiento',
    render: row => formatIsoDate(row.expiryDate),
  },
  {
    key: 'limit',
    header: 'Límite tarjeta',
    render: row => formatAmount(row.limit),
  },
  {
    key: 'currency',
    header: 'Moneda',
    render: row => catalogLabel('currencies', row.currency),
  },
  {
    key: 'balanceColones',
    header: 'Saldo colones',
    render: row => formatAmount(row.balanceColones),
  },
  {
    key: 'installmentColones',
    header: 'Cuota colones',
    render: row => formatAmount(row.installmentColones),
  },
  {
    key: 'balanceDollars',
    header: 'Saldo dólares',
    render: row => formatAmount(row.balanceDollars),
  },
  {
    key: 'installmentDollars',
    header: 'Cuota dólares',
    render: row => formatAmount(row.installmentDollars),
  },
  {
    key: 'lastFour',
    header: 'Últimos 4 # de operación',
    render: row => row.lastFour,
  },
];

interface DialogState {
  open: boolean;
  item?: CreditCardItem;
}

/**
 * Paso 9, Tarjetas de crédito (DEC-015, nodo Figma 43121:2819). Tabla
 * editable de tarjetas (alta, edicion y retiro) y, debajo, «Saldo de
 * tarjetas de crédito» con los totales por moneda. Cada tarjeta lleva saldo y
 * cuota en colones y en dolares (D-04). La tabla puede quedar vacia sin
 * bloquear el avance (D-16), por eso el paso no define reglas de validacion.
 * Cada cambio se guarda en el borrador al instante (D-11) y los totales los
 * entrega el backend (D-10, ver CreditCardsTotalsService).
 */
const CreditCards = ({ values, onChange }: StepProps) => {
  // Vuelve a dibujar la tabla cuando llegan los catalogos del servidor.
  useCatalogs();
  const { notify } = useNotification();
  const cards = (values as CreditCardsValues).cards ?? NO_CARDS;
  const { totals, status, retry } = useCreditCardsTotals(cards);
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const hasError = status === 'error';
  useEffect(() => {
    if (hasError) notify(TOAST_MESSAGES.requestFailed);
  }, [hasError, notify]);

  const setCards = (next: CreditCardItem[]) =>
    onChange({ ...values, cards: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: CreditCardItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setCards(cards.map(card => (card.id === id ? { ...data, id } : card)));
    } else {
      setCards([...cards, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (card: CreditCardItem) => {
    setCards(cards.filter(item => item.id !== card.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <div className={styles.creditCards}>
      <RecordsTable
        caption="Tarjetas de crédito"
        title="Indique la información de sus tarjetas de crédito"
        columns={COLUMNS}
        rows={cards}
        getRowLabel={card => `tarjeta ${card.lastFour}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={card => setDialog({ open: true, item: card })}
        onDelete={handleDelete}
      />
      {status === 'error' && (
        <RetryNotice
          message="No se pudieron cargar las cifras. Revise su conexión e inténtelo de nuevo."
          onRetry={retry}
        />
      )}
      <CurrencyTotals
        heading="Saldo de tarjetas de crédito"
        colonesTitle="Saldo total de tarjetas en colones"
        dolaresTitle="Saldo total de tarjetas en dólares"
        totals={totals}
      />
      <CreditCardDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </div>
  );
};

export default CreditCards;
