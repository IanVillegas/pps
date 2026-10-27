'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { CurrencySelect, Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import { toDropdownOptions } from '@/services/CatalogService';
import { useCatalog } from '@/utils/hooks/useCatalog';
import type {
  SavingsAccountItem,
  SavingsAccountItemData,
} from '@/types/Savings.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { amountToCents } from '@/utils/money';
import styles from './SavingsDialog.module.scss';

const FORM_ID = 'savings-form';

type SavingsErrors = Partial<Record<keyof SavingsAccountItemData, string>>;

const EMPTY: SavingsAccountItemData = {
  accountNumber: '',
  holderName: '',
  relationship: '',
  amount: '',
  currency: '',
  entity: '',
};

/**
 * Valida el formulario de una cuenta de ahorro. Los seis campos son
 * obligatorios (Figma, nodo 43121:4067: todos llevan asterisco).
 */
export const validateSavingsAccount = (
  values: SavingsAccountItemData
): SavingsErrors => {
  const errors: SavingsErrors = {};
  if (!values.accountNumber.trim()) {
    errors.accountNumber = 'El número de cuenta es requerido';
  }
  if (!values.holderName.trim()) {
    errors.holderName = 'El nombre del titular es requerido';
  }
  if (!values.relationship) {
    errors.relationship = 'La relación con la cuenta es requerida';
  }
  // Con MoneyInput el campo solo admite un monto con centavos, asi que lo unico
  // que puede faltar es escribirlo (0.00 si es valido).
  if (amountToCents(values.amount) === null) {
    errors.amount = 'El monto es requerido';
  }
  if (!values.currency) errors.currency = 'La moneda es requerida';
  if (!values.entity) errors.entity = 'La entidad financiera es requerida';
  return errors;
};

interface SavingsFormProps {
  item?: SavingsAccountItem;
  onSave: (data: SavingsAccountItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const SavingsForm = ({ item, onSave }: SavingsFormProps) => {
  const relationships = toDropdownOptions(useCatalog('accountRelationships'));
  const entities = toDropdownOptions(useCatalog('financialEntities'));
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SavingsAccountItemData>(item ?? EMPTY);
  const [errors, setErrors] = useState<SavingsErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<SavingsAccountItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateSavingsAccount(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateSavingsAccount(state);
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
      accountNumber: state.accountNumber.trim(),
      holderName: state.holderName.trim(),
      relationship: state.relationship,
      amount: state.amount,
      currency: state.currency,
      entity: state.entity,
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.savings__form}
      onSubmit={handleSubmit}
    >
      <InputText
        label="Número de cuenta *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.accountNumber}
        value={state.accountNumber}
        errors={errors.accountNumber}
        onChange={event => update({ accountNumber: event.target.value })}
      />
      <InputText
        label="Nombre del titular *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.personName}
        value={state.holderName}
        errors={errors.holderName}
        onChange={event => update({ holderName: event.target.value })}
      />
      {/* Moneda antes que monto: la moneda elegida decide el icono del monto. */}
      <CurrencySelect
        label="Moneda *"
        value={state.currency || undefined}
        errors={errors.currency}
        onChange={value => update({ currency: value })}
      />
      <Dropdown
        label="Relación con la cuenta *"
        placeholder="Selecciona"
        options={relationships}
        value={state.relationship || undefined}
        errors={errors.relationship}
        onChange={value => update({ relationship: value })}
      />
      <MoneyInput
        label="Monto *"
        currency={state.currency}
        value={state.amount}
        errors={errors.amount}
        onChange={value => update({ amount: value })}
      />
      <Dropdown
        label="Entidad financiera *"
        placeholder="Selecciona"
        options={entities}
        value={state.entity || undefined}
        errors={errors.entity}
        onChange={value => update({ entity: value })}
      />
    </form>
  );
};

interface SavingsDialogProps {
  open: boolean;
  /** Cuenta que se edita; sin ella, el modal es para agregar una nueva. */
  item?: SavingsAccountItem;
  onSave: (data: SavingsAccountItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos económicos» (DEC-012, nodo Figma 43121:4067). Usa
 * AppDialog (dialogo estandar de DecPat, DEC-002G). El texto de
 * la accion es «Agregar» (Figma) al crear y «Guardar» al editar (Figma solo
 * dibuja el alta).
 */
const SavingsDialog = ({ open, item, onSave, onClose }: SavingsDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="lg"
    title="Datos económicos"
    srDescription="Complete los datos de la cuenta de ahorro. Los campos con asterisco son obligatorios."
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
    <SavingsForm item={item} onSave={onSave} />
  </AppDialog>
);

export default SavingsDialog;
