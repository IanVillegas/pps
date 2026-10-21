'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import type {
  LegalEntityItem,
  LegalEntityItemData,
} from '@/types/LegalEntity.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import styles from './LegalEntityDialog.module.scss';

const FORM_ID = 'legal-entity-form';

type LegalEntityErrors = Partial<Record<keyof LegalEntityItemData, string>>;

const EMPTY: LegalEntityItemData = {
  name: '',
  legalId: '',
  purpose: '',
  term: '',
};

/**
 * Valida el formulario de una personeria juridica. Los cuatro campos son
 * obligatorios (Figma, nodo 43121:2440: todos llevan asterisco) y un texto
 * formado solo por espacios cuenta como vacio. No se valida el formato de la
 * cedula juridica ni el contenido del plazo: Figma no los define.
 */
export const validateLegalEntity = (
  values: LegalEntityItemData
): LegalEntityErrors => {
  const errors: LegalEntityErrors = {};
  if (!values.name.trim()) errors.name = 'El nombre es requerido';
  if (!values.legalId.trim()) {
    errors.legalId = 'La cédula jurídica es requerida';
  }
  if (!values.purpose.trim()) errors.purpose = 'El objetivo es requerido';
  if (!values.term.trim()) errors.term = 'El plazo es requerido';
  return errors;
};

interface LegalEntityFormProps {
  item?: LegalEntityItem;
  onSave: (data: LegalEntityItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const LegalEntityForm = ({ item, onSave }: LegalEntityFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<LegalEntityItemData>(
    item
      ? {
          name: item.name,
          legalId: item.legalId,
          purpose: item.purpose,
          term: item.term,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState<LegalEntityErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<LegalEntityItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateLegalEntity(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateLegalEntity(state);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setAttempted(true);
      // Espera al render para que el campo ya tenga aria-invalid.
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus()
      );
      return;
    }
    onSave({
      name: state.name.trim(),
      legalId: state.legalId.trim(),
      purpose: state.purpose.trim(),
      term: state.term.trim(),
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.legalEntity__form}
      onSubmit={handleSubmit}
    >
      <InputText
        label="Nombre *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={state.name}
        errors={errors.name}
        onChange={event => update({ name: event.target.value })}
      />
      <InputText
        label="Cédula jurídica *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.idNumber}
        value={state.legalId}
        errors={errors.legalId}
        onChange={event => update({ legalId: event.target.value })}
      />
      <InputText
        label="Objetivo *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.legalEntityPurpose}
        value={state.purpose}
        errors={errors.purpose}
        onChange={event => update({ purpose: event.target.value })}
      />
      {/* «Plazo» es un numero (en el sistema original se ve, por ejemplo, 3);
          su unidad no esta definida, asi que solo se piden digitos. */}
      <InputText
        label="Plazo *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.legalEntityTerm}
        value={state.term}
        errors={errors.term}
        onChange={event =>
          update({ term: event.target.value.replace(/\D/g, '') })
        }
      />
    </form>
  );
};

interface LegalEntityDialogProps {
  open: boolean;
  /** Personeria que se edita; sin ella, el modal es para agregar una nueva. */
  item?: LegalEntityItem;
  onSave: (data: LegalEntityItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos de la personería jurídica» (DEC-016A, nodo Figma 43121:2440).
 * Usa AppDialog (dialogo estandar de DecPat, DEC-002G). El texto de la accion
 * es «Agregar» (Figma) al crear y «Guardar» al editar (Figma solo dibuja el
 * alta).
 */
const LegalEntityDialog = ({
  open,
  item,
  onSave,
  onClose,
}: LegalEntityDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="lg"
    title="Datos de la personería jurídica"
    srDescription="Complete los datos de la personería jurídica. Los campos con asterisco son obligatorios."
    footer={
      <>
        <Button
          text="Cancelar"
          color={ButtonColor.Secondary}
          size="medium"
          type="button"
          onClick={onClose}
        />
        <Button
          text={item ? 'Guardar' : 'Agregar'}
          color={ButtonColor.Cta}
          size="medium"
          type="submit"
          form={FORM_ID}
        />
      </>
    }
  >
    <LegalEntityForm item={item} onSave={onSave} />
  </AppDialog>
);

export default LegalEntityDialog;
