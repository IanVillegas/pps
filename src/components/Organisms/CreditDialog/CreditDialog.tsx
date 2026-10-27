'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { CurrencySelect, Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import DatePicker from '@/sad-aml-shared/components/Molecules/DatePicker/DatePicker';
import { toDropdownOptions } from '@/services/CatalogService';
import { useCatalog } from '@/utils/hooks/useCatalog';
import type { CreditItem, CreditItemData } from '@/types/Credit.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { amountToCents } from '@/utils/money';
import styles from './CreditDialog.module.scss';

const FORM_ID = 'credit-form';

type CreditErrors = Partial<Record<keyof CreditItemData, string>>;

interface FormState extends CreditItemData {
  /** La fecha se escribio pero no forma una fecha real (ej. 31/02). */
  endDateInvalid: boolean;
}

const EMPTY: FormState = {
  entity: '',
  loanType: '',
  initialAmount: '',
  currentBalance: '',
  installment: '',
  loanNumber: '',
  currency: '',
  endDate: '',
  endDateInvalid: false,
};

// Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
const amountError = (value: string, requiredMessage: string) =>
  amountToCents(value) === null ? requiredMessage : undefined;

/**
 * Valida el formulario de un credito. Los ocho campos son obligatorios
 * (Figma, nodo 43121:3231: todos llevan asterisco). La fecha de conclusion
 * solo tiene que ser una fecha real; no se le pone un limite (puede ser
 * futura, que es lo normal en un credito vigente).
 */
export const validateCredit = (
  values: CreditItemData & { endDateInvalid?: boolean }
): CreditErrors => {
  const errors: CreditErrors = {};
  if (!values.entity) errors.entity = 'La entidad financiera es requerida';
  if (!values.loanType.trim()) {
    errors.loanType = 'El tipo de préstamo es requerido';
  }
  const initial = amountError(
    values.initialAmount,
    'El monto inicial es requerido'
  );
  if (initial) errors.initialAmount = initial;
  const balance = amountError(
    values.currentBalance,
    'El saldo actual es requerido'
  );
  if (balance) errors.currentBalance = balance;
  const installment = amountError(
    values.installment,
    'El monto de la cuota es requerido'
  );
  if (installment) errors.installment = installment;
  if (!values.loanNumber.trim()) {
    errors.loanNumber = 'El número de préstamo es requerido';
  }
  if (!values.currency) errors.currency = 'La moneda es requerida';
  if (values.endDateInvalid) {
    errors.endDate = 'Escriba una fecha válida';
  } else if (!values.endDate) {
    errors.endDate = 'La fecha de conclusión es requerida';
  }
  return errors;
};

interface CreditFormProps {
  item?: CreditItem;
  onSave: (data: CreditItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const CreditForm = ({ item, onSave }: CreditFormProps) => {
  const entities = toDropdownOptions(useCatalog('financialEntities'));
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(
    item ? { ...item, endDateInvalid: false } : EMPTY
  );
  const [errors, setErrors] = useState<CreditErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<FormState>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateCredit(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateCredit(state);
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
      entity: state.entity,
      loanType: state.loanType.trim(),
      initialAmount: state.initialAmount,
      currentBalance: state.currentBalance,
      installment: state.installment,
      loanNumber: state.loanNumber.trim(),
      currency: state.currency,
      endDate: state.endDate,
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.credit__form}
      onSubmit={handleSubmit}
    >
      <Dropdown
        label="Entidad financiera *"
        placeholder="Selecciona"
        options={entities}
        value={state.entity || undefined}
        errors={errors.entity}
        onChange={value => update({ entity: value })}
      />
      <InputText
        label="Tipo de préstamo *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.loanType}
        value={state.loanType}
        errors={errors.loanType}
        onChange={event => update({ loanType: event.target.value })}
      />
      {/* Moneda antes que los montos: la moneda elegida decide su icono. */}
      <CurrencySelect
        label="Moneda *"
        value={state.currency || undefined}
        errors={errors.currency}
        onChange={value => update({ currency: value })}
      />
      <InputText
        label="Número de préstamo *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.accountNumber}
        value={state.loanNumber}
        errors={errors.loanNumber}
        onChange={event => update({ loanNumber: event.target.value })}
      />
      <MoneyInput
        label="Monto inicial *"
        currency={state.currency}
        value={state.initialAmount}
        errors={errors.initialAmount}
        onChange={value => update({ initialAmount: value })}
      />
      <MoneyInput
        label="Saldo actual *"
        currency={state.currency}
        value={state.currentBalance}
        errors={errors.currentBalance}
        onChange={value => update({ currentBalance: value })}
      />
      <MoneyInput
        label="Monto cuota *"
        currency={state.currency}
        value={state.installment}
        errors={errors.installment}
        onChange={value => update({ installment: value })}
      />
      <DatePicker
        label="Fecha de conclusión *"
        placeholder="DD/MM/AAAA"
        value={state.endDate || undefined}
        errors={errors.endDate}
        onChange={date => {
          if (!date) {
            update({ endDate: '', endDateInvalid: false });
          } else if (date.isValid()) {
            update({
              endDate: date.format('YYYY-MM-DD'),
              endDateInvalid: false,
            });
          } else {
            // Escritura incompleta o imposible (31/02): no se guarda como
            // fecha, pero tampoco se trata como "vacio".
            update({ endDate: '', endDateInvalid: true });
          }
        }}
      />
    </form>
  );
};

interface CreditDialogProps {
  open: boolean;
  /** Credito que se edita; sin el, el modal es para agregar uno nuevo. */
  item?: CreditItem;
  onSave: (data: CreditItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Créditos» (DEC-014, nodo Figma 43121:3231). Usa AppDialog (dialogo
 * estandar de DecPat, DEC-002G). El texto de la accion es «Agregar» (Figma) al
 * crear y «Guardar» al editar (Figma solo dibuja el alta).
 */
const CreditDialog = ({ open, item, onSave, onClose }: CreditDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="lg"
    title="Créditos"
    srDescription="Complete los datos del crédito. Los campos con asterisco son obligatorios."
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
    <CreditForm item={item} onSave={onSave} />
  </AppDialog>
);

export default CreditDialog;
