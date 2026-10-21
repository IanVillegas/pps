'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { CurrencySelect, Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import DatePicker from '@/sad-aml-shared/components/Molecules/DatePicker/DatePicker';
import { FINANCIAL_ENTITY_OPTIONS } from '@/services/CatalogService';
import type {
  CreditCardItem,
  CreditCardItemData,
} from '@/types/CreditCard.types';
import { amountToCents } from '@/utils/money';
import styles from './CreditCardDialog.module.scss';

const FORM_ID = 'credit-card-form';

const toOptions = (options: { value: string; label: string }[]) =>
  options.map(option => ({ value: option.value, element: option.label }));

const ENTITIES = toOptions(FINANCIAL_ENTITY_OPTIONS);

type CreditCardErrors = Partial<Record<keyof CreditCardItemData, string>>;

interface FormState extends CreditCardItemData {
  /** La fecha se escribio pero no forma una fecha real (ej. 31/02). */
  expiryDateInvalid: boolean;
}

const EMPTY: FormState = {
  period: '',
  entity: '',
  currency: '',
  expiryDate: '',
  limit: '',
  lastFour: '',
  balanceColones: '',
  installmentColones: '',
  balanceDollars: '',
  installmentDollars: '',
  expiryDateInvalid: false,
};

// Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
const amountError = (value: string, requiredMessage: string) =>
  amountToCents(value) === null ? requiredMessage : undefined;

/**
 * Valida el formulario de una tarjeta. Los diez campos son obligatorios
 * (Figma, nodo 43121:2768: todos llevan asterisco). «Últimos 4 # de
 * operación» pide exactamente cuatro dígitos, como dice su etiqueta. La fecha
 * de vencimiento solo tiene que ser una fecha real: no se le pone un limite.
 */
export const validateCreditCard = (
  values: CreditCardItemData & { expiryDateInvalid?: boolean }
): CreditCardErrors => {
  const errors: CreditCardErrors = {};
  // «Periodo» es el año: Figma lo dibuja como un campo de texto, pero el
  // sistema original solo muestra y pide el año (no una fecha completa). Solo
  // se exigen cuatro digitos; no se inventa un rango de años.
  if (!values.period) {
    errors.period = 'El periodo es requerido';
  } else if (!/^\d{4}$/.test(values.period)) {
    errors.period = 'Escriba el año con 4 dígitos';
  }
  if (!values.entity) errors.entity = 'La entidad financiera es requerida';
  if (!values.currency) errors.currency = 'La moneda es requerida';
  if (values.expiryDateInvalid) {
    errors.expiryDate = 'Escriba una fecha válida';
  } else if (!values.expiryDate) {
    errors.expiryDate = 'La fecha de vencimiento es requerida';
  }
  const limit = amountError(
    values.limit,
    'El límite de la tarjeta es requerido'
  );
  if (limit) errors.limit = limit;
  if (!values.lastFour) {
    errors.lastFour = 'Los últimos 4 dígitos de la operación son requeridos';
  } else if (!/^\d{4}$/.test(values.lastFour)) {
    errors.lastFour = 'Escriba los 4 últimos dígitos';
  }
  const amounts = [
    ['balanceColones', 'El saldo en colones es requerido'],
    ['installmentColones', 'La cuota en colones es requerida'],
    ['balanceDollars', 'El saldo en dólares es requerido'],
    ['installmentDollars', 'La cuota en dólares es requerida'],
  ] as const;
  amounts.forEach(([field, requiredMessage]) => {
    const error = amountError(values[field], requiredMessage);
    if (error) errors[field] = error;
  });
  return errors;
};

interface CreditCardFormProps {
  item?: CreditCardItem;
  onSave: (data: CreditCardItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const CreditCardForm = ({ item, onSave }: CreditCardFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<FormState>(
    item ? { ...item, expiryDateInvalid: false } : EMPTY
  );
  const [errors, setErrors] = useState<CreditCardErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<FormState>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateCreditCard(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateCreditCard(state);
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
      period: state.period.trim(),
      entity: state.entity,
      currency: state.currency,
      expiryDate: state.expiryDate,
      limit: state.limit,
      lastFour: state.lastFour,
      balanceColones: state.balanceColones,
      installmentColones: state.installmentColones,
      balanceDollars: state.balanceDollars,
      installmentDollars: state.installmentDollars,
    });
  };

  const digitsOnly = (value: string) => value.replace(/\D/g, '');

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.creditCard__form}
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
      <InputText
        label="Periodo *"
        placeholder="AAAA"
        inputMode="numeric"
        maxLength={4}
        value={state.period}
        errors={errors.period}
        onChange={event => update({ period: digitsOnly(event.target.value) })}
      />
      <CurrencySelect
        label="Moneda *"
        value={state.currency || undefined}
        errors={errors.currency}
        onChange={value => update({ currency: value })}
      />
      {/* El límite va en la moneda de la tarjeta. */}
      <MoneyInput
        label="Límite de tarjeta *"
        currency={state.currency}
        value={state.limit}
        errors={errors.limit}
        onChange={value => update({ limit: value })}
      />
      <DatePicker
        label="Fecha de vencimiento *"
        placeholder="DD/MM/AAAA"
        value={state.expiryDate || undefined}
        errors={errors.expiryDate}
        onChange={date => {
          if (!date) {
            update({ expiryDate: '', expiryDateInvalid: false });
          } else if (date.isValid()) {
            update({
              expiryDate: date.format('YYYY-MM-DD'),
              expiryDateInvalid: false,
            });
          } else {
            // Escritura incompleta o imposible (31/02): no se guarda como
            // fecha, pero tampoco se trata como "vacio".
            update({ expiryDate: '', expiryDateInvalid: true });
          }
        }}
      />
      <InputText
        label="Últimos 4 # de operación *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={4}
        value={state.lastFour}
        errors={errors.lastFour}
        onChange={event => update({ lastFour: digitsOnly(event.target.value) })}
      />
      {/* Las columnas de colones y de dólares llevan siempre su propia moneda. */}
      <MoneyInput
        label="Saldo colones *"
        currency="colones"
        value={state.balanceColones}
        errors={errors.balanceColones}
        onChange={value => update({ balanceColones: value })}
      />
      <MoneyInput
        label="Cuota colones *"
        currency="colones"
        value={state.installmentColones}
        errors={errors.installmentColones}
        onChange={value => update({ installmentColones: value })}
      />
      <MoneyInput
        label="Saldo dólares *"
        currency="dolares"
        value={state.balanceDollars}
        errors={errors.balanceDollars}
        onChange={value => update({ balanceDollars: value })}
      />
      <MoneyInput
        label="Cuota dólares *"
        currency="dolares"
        value={state.installmentDollars}
        errors={errors.installmentDollars}
        onChange={value => update({ installmentDollars: value })}
      />
    </form>
  );
};

interface CreditCardDialogProps {
  open: boolean;
  /** Tarjeta que se edita; sin ella, el modal es para agregar una nueva. */
  item?: CreditCardItem;
  onSave: (data: CreditCardItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Tarjetas de crédito» (DEC-015, nodo Figma 43121:2768). Usa AppDialog
 * (dialogo estandar de DecPat, DEC-002G). El texto de la accion es «Agregar»
 * (Figma) al crear y «Guardar» al editar (Figma solo dibuja el alta).
 */
const CreditCardDialog = ({
  open,
  item,
  onSave,
  onClose,
}: CreditCardDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="lg"
    title="Tarjetas de crédito"
    srDescription="Complete los datos de la tarjeta. Los campos con asterisco son obligatorios."
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
    <CreditCardForm item={item} onSave={onSave} />
  </AppDialog>
);

export default CreditCardDialog;
