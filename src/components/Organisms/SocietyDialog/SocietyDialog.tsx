'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import { SOCIETY_TYPE_OPTIONS } from '@/services/CatalogService';
import type { SocietyItem, SocietyItemData } from '@/types/LegalEntity.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { amountToCents } from '@/utils/money';
import styles from './SocietyDialog.module.scss';

const FORM_ID = 'society-form';

const SOCIETY_TYPES = SOCIETY_TYPE_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));

type SocietyErrors = Partial<Record<keyof SocietyItemData, string>>;

const EMPTY: SocietyItemData = {
  name: '',
  legalId: '',
  societyType: '',
  role: '',
  term: '',
  sharePercent: '',
  dietAmount: '',
  powerType: '',
  sumLimit: '',
};

/**
 * Valida el formulario de una sociedad. Los nueve campos son obligatorios
 * (Figma, nodo 43121:2392: todos llevan asterisco; el usuario confirmo el
 * 2026-10-21 que lo son tambien los cuatro «Si es…»). Un texto formado solo
 * por espacios cuenta como vacio. No se valida el formato de la cedula, ni un
 * rango para el porcentaje, ni reglas segun el cargo: nadie las definio (D-28).
 */
export const validateSociety = (values: SocietyItemData): SocietyErrors => {
  const errors: SocietyErrors = {};
  if (!values.name.trim()) errors.name = 'El nombre es requerido';
  if (!values.legalId.trim()) {
    errors.legalId = 'La cédula jurídica es requerida';
  }
  if (!values.societyType) {
    errors.societyType = 'El tipo de sociedad es requerido';
  }
  if (!values.role.trim()) errors.role = 'El cargo es requerido';
  if (!values.term.trim()) errors.term = 'El plazo es requerido';
  if (!values.sharePercent.trim()) {
    errors.sharePercent = 'El porcentaje de acciones es requerido';
  }
  // Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
  if (amountToCents(values.dietAmount) === null) {
    errors.dietAmount = 'El monto de dietas es requerido';
  }
  if (!values.powerType.trim()) {
    errors.powerType = 'El tipo de poder es requerido';
  }
  if (amountToCents(values.sumLimit) === null) {
    errors.sumLimit = 'El límite de suma es requerido';
  }
  return errors;
};

/** Deja solo digitos y un unico punto decimal («12.5»). */
const toPercent = (raw: string): string => {
  const cleaned = raw.replace(/[^\d.]/g, '');
  const [whole, ...rest] = cleaned.split('.');
  return rest.length > 0 ? `${whole}.${rest.join('')}` : whole;
};

interface SocietyFormProps {
  item?: SocietyItem;
  onSave: (data: SocietyItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const SocietyForm = ({ item, onSave }: SocietyFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SocietyItemData>(
    item
      ? {
          name: item.name,
          legalId: item.legalId,
          societyType: item.societyType,
          role: item.role,
          term: item.term,
          sharePercent: item.sharePercent,
          dietAmount: item.dietAmount,
          powerType: item.powerType,
          sumLimit: item.sumLimit,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState<SocietyErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<SocietyItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateSociety(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateSociety(state);
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
      societyType: state.societyType,
      role: state.role.trim(),
      term: state.term.trim(),
      sharePercent: state.sharePercent.trim(),
      dietAmount: state.dietAmount,
      powerType: state.powerType.trim(),
      sumLimit: state.sumLimit,
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.society__form}
      onSubmit={handleSubmit}
    >
      <InputText
        label="Nombre de la sociedad *"
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
      <Dropdown
        label="Tipo de sociedad *"
        placeholder="Selecciona"
        options={SOCIETY_TYPES}
        value={state.societyType || undefined}
        errors={errors.societyType}
        onChange={value => update({ societyType: value })}
      />
      <InputText
        label="Cargo en la sociedad *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.societyRole}
        value={state.role}
        errors={errors.role}
        onChange={event => update({ role: event.target.value })}
      />
      {/* Igual que en las personerias: «Plazo» es un numero sin unidad. */}
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
      <div className={styles.society__wide}>
        <InputText
          label="Si es accionista en una sociedad indique el porcentaje de acciones o participación que posee *"
          placeholder="Escribe aquí"
          inputMode="decimal"
          maxLength={FIELD_MAX_LENGTH.sharePercent}
          value={state.sharePercent}
          errors={errors.sharePercent}
          onChange={event =>
            update({ sharePercent: toPercent(event.target.value) })
          }
        />
      </div>
      <div className={styles.society__wide}>
        <MoneyInput
          label="Si es miembro de Junta Directiva de alguna sociedad, indique el monto que percibe de dietas por ello *"
          currency={null}
          value={state.dietAmount}
          errors={errors.dietAmount}
          onChange={value => update({ dietAmount: value })}
        />
      </div>
      <div className={styles.society__wide}>
        <InputText
          label="Si es apoderado en alguna sociedad, indique el tipo de poder *"
          placeholder="Escribe aquí"
          maxLength={FIELD_MAX_LENGTH.powerType}
          value={state.powerType}
          errors={errors.powerType}
          onChange={event => update({ powerType: event.target.value })}
        />
      </div>
      <div className={styles.society__wide}>
        <MoneyInput
          label="Si es apoderado en alguna sociedad, indique el límite de suma *"
          currency={null}
          value={state.sumLimit}
          errors={errors.sumLimit}
          onChange={value => update({ sumLimit: value })}
        />
      </div>
    </form>
  );
};

interface SocietyDialogProps {
  open: boolean;
  /** Sociedad que se edita; sin ella, el modal es para agregar una nueva. */
  item?: SocietyItem;
  onSave: (data: SocietyItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos de la sociedad» (DEC-016B, nodo Figma 43121:2392). Usa
 * AppDialog (dialogo estandar de DecPat, DEC-002G); 750 px en Figma, el
 * tamaño `lg` (805 px) es el mas cercano. El texto de la accion es «Agregar»
 * al crear y «Guardar» al editar.
 */
const SocietyDialog = ({ open, item, onSave, onClose }: SocietyDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="lg"
    title="Datos de la sociedad"
    srDescription="Complete los datos de la sociedad. Todos los campos con asterisco son obligatorios."
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
    <SocietyForm item={item} onSave={onSave} />
  </AppDialog>
);

export default SocietyDialog;
