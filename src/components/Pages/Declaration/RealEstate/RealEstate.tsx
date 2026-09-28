'use client';

import { useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import RealEstateDialog from '@/components/Organisms/RealEstateDialog/RealEstateDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import { REAL_ESTATE_DESTINATION_OPTIONS } from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  RealEstateItem,
  RealEstateItemData,
  RealEstateValues,
} from '@/types/RealEstate.types';
import { formatAmount } from '@/utils/money';
import { createId } from '@/utils/ids';

const destinationLabel = (value: string) =>
  REAL_ESTATE_DESTINATION_OPTIONS.find(option => option.value === value)
    ?.label ?? value;

const COLUMNS: RecordsTableColumn<RealEstateItem>[] = [
  {
    key: 'fincaNumber',
    header: 'Número finca',
    render: row => row.fincaNumber,
  },
  { key: 'location', header: 'Ubicación', render: row => row.location },
  {
    key: 'marketValue',
    header: 'Valor',
    render: row => formatAmount(row.marketValue),
  },
  {
    key: 'destination',
    header: 'Destino',
    render: row => destinationLabel(row.destination),
  },
  {
    key: 'acquisitionForm',
    header: 'Forma adquisición',
    render: row => row.acquisitionForm,
  },
];

interface DialogState {
  open: boolean;
  item?: RealEstateItem;
}

/**
 * Paso 4, Bienes inmuebles (DEC-010, nodo Figma 43121:4951). Tabla con alta,
 * edicion y retiro de propiedades. La tabla puede quedar vacia sin bloquear
 * el avance (D-16), por eso el paso no define reglas de validacion. Cada
 * cambio se guarda en el borrador al instante.
 */
const RealEstate = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const properties = (values as RealEstateValues).properties ?? [];
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const setProperties = (next: RealEstateItem[]) =>
    onChange({ ...values, properties: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: RealEstateItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setProperties(
        properties.map(property =>
          property.id === id ? { ...data, id } : property
        )
      );
    } else {
      setProperties([...properties, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (property: RealEstateItem) => {
    setProperties(properties.filter(item => item.id !== property.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <>
      <RecordsTable
        caption="Propiedades que posee"
        columns={COLUMNS}
        rows={properties}
        getRowLabel={property => `finca ${property.fincaNumber}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={property => setDialog({ open: true, item: property })}
        onDelete={handleDelete}
      />
      <RealEstateDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </>
  );
};

export default RealEstate;
