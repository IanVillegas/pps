'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor } from '@/components/Atoms';
import { Dropdown, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/sad-aml-shared/components/Organisms/AppDialog/AppDialog';
import { toDropdownOptions } from '@/services/CatalogService';
import { useCatalog } from '@/utils/hooks/useCatalog';
import type {
  ExpenseItem,
  ExpenseItemData,
} from '@/types/IncomeExpenses.types';
import { amountToCents } from '@/sad-aml-shared/utils/helpers/money';
import styles from './ExpenseDialog.module.scss';

const FORM_ID = 'expense-form';

type ExpenseErrors = Partial<Record<keyof ExpenseItemData, string>>;

const EMPTY: ExpenseItemData = { type: '', amount: '' };

/**
 * Valida el formulario de un egreso. Tipo y monto son obligatorios (Figma,
 * nodo 43121:5323: ambos llevan asterisco).
 */
export const validateExpenseItem = (values: ExpenseItemData): ExpenseErrors => {
  const errors: ExpenseErrors = {};
  if (!values.type) errors.type = 'El tipo de egreso es requerido';
  // Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
  if (amountToCents(values.amount) === null) {
    errors.amount = 'El monto es requerido';
  }
  return errors;
};

interface ExpenseFormProps {
  item?: ExpenseItem;
  onSave: (data: ExpenseItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera.
const ExpenseForm = ({ item, onSave }: ExpenseFormProps) => {
  const types = toDropdownOptions(useCatalog('expenseTypes'));
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<ExpenseItemData>(
    item ? { type: item.type, amount: item.amount } : EMPTY
  );
  const [errors, setErrors] = useState<ExpenseErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<ExpenseItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateExpenseItem(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateExpenseItem(state);
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
    onSave({ type: state.type, amount: state.amount });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.expense__form}
      onSubmit={handleSubmit}
    >
      <div className={`${styles.expense__text} ${styles.expense__full}`}>
        <p>Favor considerar:</p>
        <p>
          1. Los rebajos de la Asociación no deben contemplarse en este
          apartado, ya se rebajaron vía planilla y están reflejados en el
          salario neto. El saldo de los créditos y cuotas que se rebajan por mes
          de ASEGRUM deben anotarse en la cejilla 8 &quot;Créditos que
          posee&quot;.
        </p>
        <p>
          2. En este apartado anote la sumatoria de las cuotas totales que
          cancela a Grupo Mutual por concepto de créditos (aunque las mismas se
          pignoran en la cuenta, no son rebajos directos de la planilla y deben
          reportarse como un egreso mensual.)
        </p>
        <p>
          3. Los egresos registrados en este apartado, corresponden a gastos
          mensuales
        </p>
      </div>
      <Dropdown
        label="Tipo de egreso *"
        placeholder="Selecciona"
        options={types}
        value={state.type || undefined}
        errors={errors.type}
        onChange={value => update({ type: value })}
      />
      <MoneyInput
        label="Monto *"
        currency="colones"
        value={state.amount}
        errors={errors.amount}
        onChange={value => update({ amount: value })}
      />
    </form>
  );
};

interface ExpenseDialogProps {
  open: boolean;
  /** Egreso que se edita; sin el, el modal es para agregar uno nuevo. */
  item?: ExpenseItem;
  onSave: (data: ExpenseItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Egresos» (DEC-009D, nodo Figma 43121:5323): texto de «Favor
 * considerar» mas tipo y monto. Usa AppDialog (dialogo estandar de DecPat,
 * DEC-002G). El texto de la accion es «Agregar» (Figma) al crear y
 * «Guardar» al editar.
 */
const ExpenseDialog = ({ open, item, onSave, onClose }: ExpenseDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="xl"
    title="Egresos"
    srDescription="Complete los datos del egreso mensual. Los campos con asterisco son obligatorios."
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
    <ExpenseForm item={item} onSave={onSave} />
  </AppDialog>
);

export default ExpenseDialog;
