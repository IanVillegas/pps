'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor } from '@/components/Atoms';
import { CurrencySelect, Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import { FINANCIAL_ENTITY_OPTIONS } from '@/services/CatalogService';
import type {
  CurrentAccountItem,
  CurrentAccountItemData,
} from '@/types/CurrentAccount.types';
import { amountToCents } from '@/utils/money';
import styles from './CurrentAccountDialog.module.scss';

const FORM_ID = 'current-account-form';

const toOptions = (options: { value: string; label: string }[]) =>
  options.map(option => ({ value: option.value, element: option.label }));

const ENTITIES = toOptions(FINANCIAL_ENTITY_OPTIONS);

type CurrentAccountErrors = Partial<
  Record<keyof CurrentAccountItemData, string>
>;

const EMPTY: CurrentAccountItemData = { entity: '', balance: '', currency: '' };

/**
 * Valida el formulario de una cuenta corriente. Los tres campos son
 * obligatorios (Figma, nodo 43121:3674: todos llevan asterisco).
 */
export const validateCurrentAccount = (
  values: CurrentAccountItemData
): CurrentAccountErrors => {
  const errors: CurrentAccountErrors = {};
  if (!values.entity) errors.entity = 'La entidad financiera es requerida';
  // Con MoneyInput solo puede faltar escribir el saldo (0.00 es valido).
  if (amountToCents(values.balance) === null) {
    errors.balance = 'El saldo actual es requerido';
  }
  if (!values.currency) errors.currency = 'La moneda es requerida';
  return errors;
};

interface CurrentAccountFormProps {
  item?: CurrentAccountItem;
  onSave: (data: CurrentAccountItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const CurrentAccountForm = ({ item, onSave }: CurrentAccountFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<CurrentAccountItemData>(
    item
      ? { entity: item.entity, balance: item.balance, currency: item.currency }
      : EMPTY
  );
  const [errors, setErrors] = useState<CurrentAccountErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<CurrentAccountItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateCurrentAccount(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateCurrentAccount(state);
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
    onSave(state);
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.currentAccount__form}
      onSubmit={handleSubmit}
    >
      <Dropdown
        label="Entidad financiera *"
        placeholder="Selecciona"
        options={ENTITIES}
        value={state.entity || undefined}
        errors={errors.entity}
        onChange={value => update({ entity: value })}
      />
      {/* Moneda antes que saldo: la moneda elegida decide el icono del saldo. */}
      <CurrencySelect
        label="Moneda *"
        value={state.currency || undefined}
        errors={errors.currency}
        onChange={value => update({ currency: value })}
      />
      <MoneyInput
        label="Saldo actual *"
        currency={state.currency}
        value={state.balance}
        errors={errors.balance}
        onChange={value => update({ balance: value })}
      />
    </form>
  );
};

interface CurrentAccountDialogProps {
  open: boolean;
  /** Cuenta que se edita; sin ella, el modal es para agregar una nueva. */
  item?: CurrentAccountItem;
  onSave: (data: CurrentAccountItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos económicos» del paso 7 (DEC-013, nodo Figma 43121:3674). Usa
 * AppDialog (dialogo estandar de DecPat, DEC-002G). El texto de la
 * accion es «Agregar» (Figma) al crear y «Guardar» al editar (Figma solo
 * dibuja el alta).
 */
const CurrentAccountDialog = ({
  open,
  item,
  onSave,
  onClose,
}: CurrentAccountDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="sm"
    title="Datos económicos"
    srDescription="Complete los datos de la cuenta corriente. Los campos con asterisco son obligatorios."
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
    <CurrentAccountForm item={item} onSave={onSave} />
  </AppDialog>
);

export default CurrentAccountDialog;
