'use client';

import { useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/sad-aml-shared/components/Organisms/RecordsTable/RecordsTable';
import LegalEntityDialog from '@/components/Organisms/LegalEntityDialog/LegalEntityDialog';
import SocietyDialog from '@/components/Organisms/SocietyDialog/SocietyDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  LegalEntitiesValues,
  LegalEntityItem,
  LegalEntityItemData,
  SocietyItem,
  SocietyItemData,
} from '@/types/LegalEntity.types';
import { catalogLabel } from '@/services/CatalogService';
import { createId } from '@/utils/ids';
import { useCatalogs } from '@/utils/hooks/useCatalog';
import { formatAmount } from '@/sad-aml-shared/utils/helpers/money';
import styles from './LegalEntities.module.scss';

const NO_ENTITIES: LegalEntityItem[] = [];
const NO_SOCIETIES: SocietyItem[] = [];

// Mismo orden que Figma (nodo 43121:2464).
const COLUMNS: RecordsTableColumn<LegalEntityItem>[] = [
  { key: 'name', header: 'Nombre', render: row => row.name },
  { key: 'legalId', header: 'Cédula jurídica', render: row => row.legalId },
  { key: 'purpose', header: 'Objetivo', render: row => row.purpose },
  { key: 'term', header: 'Plazo', render: row => row.term },
];

// Mismo orden que Figma (nodo 43306:2214).
const SOCIETY_COLUMNS: RecordsTableColumn<SocietyItem>[] = [
  { key: 'name', header: 'Nombre', render: row => row.name },
  {
    key: 'societyType',
    header: 'Tipo de sociedad',
    render: row => catalogLabel('societyTypes', row.societyType),
  },
  { key: 'role', header: 'Cargo', render: row => row.role },
  { key: 'term', header: 'Plazo', render: row => row.term },
  {
    key: 'sharePercent',
    header: 'Porcentaje de acciones',
    render: row => row.sharePercent,
  },
  {
    key: 'dietAmount',
    header: 'Monto de dieta',
    render: row => formatAmount(row.dietAmount),
  },
  { key: 'powerType', header: 'Tipo de poder', render: row => row.powerType },
  {
    key: 'sumLimit',
    header: 'Límite suma',
    render: row => formatAmount(row.sumLimit),
  },
];

interface DialogState<T> {
  open: boolean;
  item?: T;
}

/**
 * Paso 10, Personería jurídica (DEC-016A y DEC-016B, nodos Figma 43121:2464 y
 * 43306:2214). Dos tablas editables, con alta, edicion y retiro: las
 * personerias juridicas que posee la persona y las sociedades de las que forma
 * parte. Cualquiera puede quedar vacia sin bloquear el avance (D-16), por eso
 * el paso no define reglas de validacion. Cada cambio se guarda en el borrador
 * al instante (D-11).
 */
const LegalEntities = ({ values, onChange }: StepProps) => {
  // Vuelve a dibujar la tabla cuando llegan los catalogos del servidor.
  useCatalogs();
  const { notify } = useNotification();
  const entities = (values as LegalEntitiesValues).legalEntities ?? NO_ENTITIES;
  const societies = (values as LegalEntitiesValues).societies ?? NO_SOCIETIES;
  const [dialog, setDialog] = useState<DialogState<LegalEntityItem>>({
    open: false,
  });
  const [societyDialog, setSocietyDialog] = useState<DialogState<SocietyItem>>({
    open: false,
  });

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

  const setSocieties = (next: SocietyItem[]) =>
    onChange({ ...values, societies: next });

  const closeSocietyDialog = () =>
    setSocietyDialog(current => ({ ...current, open: false }));

  const handleSaveSociety = (data: SocietyItemData) => {
    if (societyDialog.item) {
      const id = societyDialog.item.id;
      setSocieties(
        societies.map(society =>
          society.id === id ? { ...data, id } : society
        )
      );
    } else {
      setSocieties([...societies, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeSocietyDialog();
  };

  const handleDeleteSociety = (society: SocietyItem) => {
    setSocieties(societies.filter(item => item.id !== society.id));
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
        addAriaLabel="Agregar nueva personería jurídica"
        onAdd={() => setDialog({ open: true })}
        onEdit={entity => setDialog({ open: true, item: entity })}
        onDelete={handleDelete}
      />
      <RecordsTable
        caption="Sociedades"
        title="Si usted forma parte en alguna sociedad, por favor especifique."
        columns={SOCIETY_COLUMNS}
        rows={societies}
        getRowLabel={society => `sociedad ${society.name}`}
        addAriaLabel="Agregar nueva sociedad"
        dense
        onAdd={() => setSocietyDialog({ open: true })}
        onEdit={society => setSocietyDialog({ open: true, item: society })}
        onDelete={handleDeleteSociety}
      />
      <LegalEntityDialog
        open={dialog.open}
        item={dialog.item}
        onSave={handleSave}
        onClose={closeDialog}
      />
      <SocietyDialog
        open={societyDialog.open}
        item={societyDialog.item}
        onSave={handleSaveSociety}
        onClose={closeSocietyDialog}
      />
    </div>
  );
};

export default LegalEntities;
