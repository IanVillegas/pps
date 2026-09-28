'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { Dropdown } from '@/components/Molecules';
import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import DatePicker from '@/sad-aml-shared/components/Molecules/DatePicker/DatePicker';
import {
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from '@/services/CatalogService';
import type { FamilyMember, FamilyMemberData } from '@/types/Family.types';
import { isFutureIso, todayIso } from '@/utils/dates';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import styles from './FamilyDialog.module.scss';

const FORM_ID = 'family-member-form';
// Rango simbolico de edad (sin contrato de backend, mismo criterio que
// fieldLimits.ts).
const MAX_AGE = 120;

const RELATIONSHIPS = RELATIONSHIP_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));
const GENDERS = GENDER_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));

type FamilyErrors = Partial<Record<keyof FamilyMemberData, string>>;

interface FormState extends FamilyMemberData {
  /** La fecha se escribio pero no forma una fecha real (ej. 31/02). */
  birthDateInvalid: boolean;
}

const EMPTY: FormState = {
  fullName: '',
  age: '',
  relationship: '',
  gender: '',
  birthDate: '',
  birthDateInvalid: false,
};

// Sin mayusculas ni tildes ni espacios de mas: "  José  Mora" y "jose mora"
// son la misma persona.
const normalizeName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Valida el formulario de un familiar. `others` son los demas familiares ya
 * registrados (sin el que se esta editando): un duplicado es la misma persona,
 * mismo nombre y misma fecha de nacimiento.
 *
 * NO compara la edad con la fecha de nacimiento (D-19, abierto).
 */
export const validateFamilyMember = (
  values: FamilyMemberData & { birthDateInvalid?: boolean },
  others: FamilyMember[] = []
): FamilyErrors => {
  const errors: FamilyErrors = {};
  if (!values.fullName.trim()) {
    errors.fullName = 'El nombre y los apellidos son requeridos';
  }

  if (!values.age.trim()) {
    errors.age = 'La edad es requerida';
  } else if (!/^\d+$/.test(values.age) || Number(values.age) > MAX_AGE) {
    errors.age = `Escriba una edad entre 0 y ${MAX_AGE}`;
  }

  if (!values.relationship) errors.relationship = 'El parentesco es requerido';
  if (!values.gender) errors.gender = 'El género es requerido';

  if (values.birthDateInvalid) {
    errors.birthDate = 'Escriba una fecha válida';
  } else if (!values.birthDate) {
    errors.birthDate = 'La fecha de nacimiento es requerida';
  } else if (isFutureIso(values.birthDate)) {
    errors.birthDate = 'La fecha no puede ser futura';
  }

  if (!errors.fullName && !errors.birthDate) {
    const name = normalizeName(values.fullName);
    const isDuplicate = others.some(
      other =>
        normalizeName(other.fullName) === name &&
        other.birthDate === values.birthDate
    );
    if (isDuplicate) errors.fullName = 'Este familiar ya está registrado';
  }
  return errors;
};

interface FamilyFormProps {
  member?: FamilyMember;
  others: FamilyMember[];
  onSave: (data: FamilyMemberData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const FamilyForm = ({ member, others, onSave }: FamilyFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(
    member ? { ...member, birthDateInvalid: false } : EMPTY
  );
  const [errors, setErrors] = useState<FamilyErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<FormState>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateFamilyMember(next, others));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateFamilyMember(state, others);
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
      fullName: state.fullName.trim(),
      age: state.age,
      relationship: state.relationship,
      gender: state.gender,
      birthDate: state.birthDate,
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.family__form}
      onSubmit={handleSubmit}
    >
      <InputText
        label="Nombre y apellidos *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={state.fullName}
        errors={errors.fullName}
        onChange={event => update({ fullName: event.target.value })}
      />
      <InputText
        label="Edad en años cumplidos *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.age}
        value={state.age}
        errors={errors.age}
        onChange={event =>
          update({ age: event.target.value.replace(/\D/g, '') })
        }
      />
      <Dropdown
        label="Parentesco *"
        placeholder="Selecciona"
        options={RELATIONSHIPS}
        value={state.relationship || undefined}
        errors={errors.relationship}
        onChange={value => update({ relationship: value })}
      />
      <Dropdown
        label="Género *"
        placeholder="Selecciona"
        options={GENDERS}
        value={state.gender || undefined}
        errors={errors.gender}
        onChange={value => update({ gender: value })}
      />
      <DatePicker
        label="Fecha de nacimiento *"
        placeholder="DD/MM/AAAA"
        maxDate={todayIso()}
        value={state.birthDate || undefined}
        errors={errors.birthDate}
        onChange={date => {
          if (!date) {
            update({ birthDate: '', birthDateInvalid: false });
          } else if (date.isValid()) {
            update({
              birthDate: date.format('YYYY-MM-DD'),
              birthDateInvalid: false,
            });
          } else {
            // Escritura incompleta o imposible (31/02): no se guarda como
            // fecha, pero tampoco se trata como "vacio".
            update({ birthDate: '', birthDateInvalid: true });
          }
        }}
      />
    </form>
  );
};

interface FamilyDialogProps {
  open: boolean;
  /** Familiar que se edita; sin el, el modal es para agregar uno nuevo. */
  member?: FamilyMember;
  /** Demas familiares del paso, para detectar duplicados. */
  others: FamilyMember[];
  onSave: (data: FamilyMemberData) => void;
  onClose: () => void;
}

/**
 * Modal «Miembro del nucleo familiar» (DEC-008B, nodo Figma 43121:6211). Usa
 * Modal de sad-aml-shared, mismo patron que HelpDialog/DeclarationIntroDialog.
 * El texto de la accion es «Agregar» (Figma) al crear y «Guardar» al editar
 * (Figma solo dibuja el alta).
 */
const FamilyDialog = ({
  open,
  member,
  others,
  onSave,
  onClose,
}: FamilyDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    className={styles.family}
    title="Miembro del núcleo familiar"
    description="Complete los datos del familiar. Los campos con asterisco son obligatorios."
    classNameDescription={styles.family__description}
    contentCard={<FamilyForm member={member} others={others} onSave={onSave} />}
    buttonsFooter={
      <>
        <Button
          text="Cancelar"
          color={ButtonColor.Secondary}
          size="medium"
          type="button"
          onClick={onClose}
        />
        <Button
          text={member ? 'Guardar' : 'Agregar'}
          color={ButtonColor.Cta}
          size="medium"
          type="submit"
          form={FORM_ID}
        />
      </>
    }
  />
);

export default FamilyDialog;
