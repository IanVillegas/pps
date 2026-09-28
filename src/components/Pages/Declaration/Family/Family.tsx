'use client';

import { useState } from 'react';
import RecordsTable, {
  type RecordsTableColumn,
} from '@/components/Organisms/RecordsTable/RecordsTable';
import FamilyDialog from '@/components/Organisms/FamilyDialog/FamilyDialog';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import {
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from '@/services/CatalogService';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import type {
  FamilyMember,
  FamilyMemberData,
  FamilyValues,
} from '@/types/Family.types';
import { formatIsoDate } from '@/utils/dates';
import { createId } from '@/utils/ids';

const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find(option => option.value === value)?.label ?? value;

const COLUMNS: RecordsTableColumn<FamilyMember>[] = [
  {
    key: 'relationship',
    header: 'Parentesco',
    render: row => labelOf(RELATIONSHIP_OPTIONS, row.relationship),
  },
  { key: 'fullName', header: 'Nombre', render: row => row.fullName },
  { key: 'age', header: 'Edad', render: row => row.age },
  {
    key: 'birthDate',
    header: 'Fecha nacimiento',
    render: row => formatIsoDate(row.birthDate),
  },
  {
    key: 'gender',
    header: 'Género',
    render: row => labelOf(GENDER_OPTIONS, row.gender),
  },
];

interface DialogState {
  open: boolean;
  member?: FamilyMember;
}

/**
 * Paso 2, Conformacion del nucleo familiar (DEC-008B, nodo Figma 43121:5909).
 * Tabla con alta, edicion y retiro de familiares. La tabla puede quedar vacia
 * sin bloquear el avance (D-16), por eso el paso no define reglas de
 * validacion. Cada cambio se guarda en el borrador al instante.
 */
const Family = ({ values, onChange }: StepProps) => {
  const { notify } = useNotification();
  const members = (values as FamilyValues).members ?? [];
  const [dialog, setDialog] = useState<DialogState>({ open: false });

  const setMembers = (next: FamilyMember[]) =>
    onChange({ ...values, members: next });

  // Cierra sin tocar el `member` para que el modal no cambie de contenido
  // mientras se anima el cierre.
  const closeDialog = () => setDialog(current => ({ ...current, open: false }));

  const handleSave = (data: FamilyMemberData) => {
    if (dialog.member) {
      const id = dialog.member.id;
      setMembers(
        members.map(member => (member.id === id ? { ...data, id } : member))
      );
    } else {
      setMembers([...members, { ...data, id: createId() }]);
    }
    notify(TOAST_MESSAGES.saved);
    closeDialog();
  };

  const handleDelete = (member: FamilyMember) => {
    setMembers(members.filter(item => item.id !== member.id));
    notify(TOAST_MESSAGES.removed);
  };

  return (
    <>
      <RecordsTable
        caption="Núcleo familiar"
        columns={COLUMNS}
        rows={members}
        getRowLabel={member => member.fullName}
        onAdd={() => setDialog({ open: true })}
        onEdit={member => setDialog({ open: true, member })}
        onDelete={handleDelete}
      />
      <FamilyDialog
        open={dialog.open}
        member={dialog.member}
        others={members.filter(member => member.id !== dialog.member?.id)}
        onSave={handleSave}
        onClose={closeDialog}
      />
    </>
  );
};

export default Family;
