'use client';

import { useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import MovableAssetDialog from '@/components/Organisms/MovableAssetDialog/MovableAssetDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import {
  MOVABLE_ASSET_BRAND_OPTIONS,
  MOVABLE_ASSET_TYPE_OPTIONS,
} from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  MovableAssetItem,
  MovableAssetItemData,
  MovableAssetValues,
} from '@/types/MovableAsset.types';
import { formatAmount } from '@/utils/money';
import { createId } from '@/utils/ids';

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find(option => option.value === value)?.label ?? value;

const COLUMNS: RecordsTableColumn<MovableAssetItem>[] = [
  {
    key: 'type',
    header: 'Tipo',
    render: row => labelOf(MOVABLE_ASSET_TYPE_OPTIONS, row.type),
  },
  {
    key: 'brand',
    header: 'Marca',
    render: row => labelOf(MOVABLE_ASSET_BRAND_OPTIONS, row.brand),
  },
  { key: 'plate', header: 'Placa', render: row => row.plate },
  { key: 'year', header: 'Año', render: row => row.year },
  {
    key: 'marketValue',
    header: 'Valor',
    render: row => formatAmount(row.marketValue),
  },
  { key: 'description', header: 'Descripción', render: row => row.description },
  { key: 'observation', header: 'Observación', render: row => row.observation },
];

interface DialogState {
  open: boolean;
  item?: MovableAssetItem;
}

/**
 * Paso 5, Bienes muebles (DEC-011, nodo Figma 43121:4527). Tabla con alta,
 * edicion y retiro de bienes muebles. La tabla puede quedar vacia sin
 * bloquear el avance (D-16), por eso el paso no define reglas de
 * validacion. Cada cambio se guarda en el borrador al instante.
 */
const MovableAssets = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const items = (values as MovableAssetValues).items ?? [];
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const setItems = (next: MovableAssetItem[]) =>
    onChange({ ...values, items: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: MovableAssetItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setItems(items.map(item => (item.id === id ? { ...data, id } : item)));
    } else {
      setItems([...items, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (item: MovableAssetItem) => {
    setItems(items.filter(current => current.id !== item.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <>
      <RecordsTable
        caption="Vehículos que posee"
        columns={COLUMNS}
        rows={items}
        getRowLabel={item => `placa ${item.plate}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={item => setDialog({ open: true, item })}
        onDelete={handleDelete}
      />
      <MovableAssetDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </>
  );
};

export default MovableAssets;
