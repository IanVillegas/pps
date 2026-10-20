'use client';

import { useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import LegalEntityDialog from '@/components/Organisms/LegalEntityDialog/LegalEntityDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  LegalEntitiesValues,
  LegalEntityItem,
  LegalEntityItemData,
} from '@/types/LegalEntity.types';
import { createId } from '@/utils/ids';
import styles from './LegalEntities.module.scss';

const NO_ENTITIES: LegalEntityItem[] = [];

// Mismo orden que Figma (nodo 43121:2464).
const COLUMNS: RecordsTableColumn<LegalEntityItem>[] = [
  { key: 'name', header: 'Nombre', render: row => row.name },
  { key: 'legalId', header: 'Cédula jurídica', render: row => row.legalId },
  { key: 'purpose', header: 'Objetivo', render: row => row.purpose },
  { key: 'term', header: 'Plazo', render: row => row.term },
];

interface DialogState {
  open: boolean;
  item?: LegalEntityItem;
}

/**
 * Paso 10, Personería jurídica (DEC-016A, nodo Figma 43121:2464). Tabla
 * editable con alta, edicion y retiro de las personerias juridicas que posee
 * la persona; puede quedar vacia sin bloquear el avance (D-16), por eso el
 * paso no define reglas de validacion. Cada cambio se guarda en el borrador al
 * instante (D-11). La seccion de sociedades que Figma dibuja debajo
 * corresponde a DEC-016B.
 */
const LegalEntities = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const entities = (values as LegalEntitiesValues).legalEntities ?? NO_ENTITIES;
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const setEntities = (next: LegalEntityItem[]) =>
    onChange({ ...values, legalEntities: next });

  // Cierra sin tocar el `item` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: LegalEntityItemData) => {
    if (dialog.item) {
      const id = dialog.item.id;
      setEntities(
        entities.map(entity => (entity.id === id ? { ...data, id } : entity))
      );
    } else {
      setEntities([...entities, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (entity: LegalEntityItem) => {
    setEntities(entities.filter(item => item.id !== entity.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <div className={styles.legalEntities}>
      <RecordsTable
        caption="Personerías jurídicas"
        title="Si posee usted alguna personería jurídica, por favor especifique."
        columns={COLUMNS}
        rows={entities}
        getRowLabel={entity => `personería ${entity.name}`}
        onAdd={() => setDialog({ open: true })}
        onEdit={entity => setDialog({ open: true, item: entity })}
        onDelete={handleDelete}
      />
      <LegalEntityDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </div>
  );
};

export default LegalEntities;
