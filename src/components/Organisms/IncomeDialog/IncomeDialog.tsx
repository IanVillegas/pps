'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, Textarea } from '@/components/Atoms';
import { Dropdown, FileUpload, MoneyInput } from '@/components/Molecules';
import AppDialog from '@/sad-aml-shared/components/Organisms/AppDialog/AppDialog';
import { toDropdownOptions } from '@/services/CatalogService';
import { useCatalog } from '@/utils/hooks/useCatalog';
import type { AttachmentFile } from '@/sad-aml-shared/types/Attachment.types';
import type { IncomeItem, IncomeItemData } from '@/types/IncomeExpenses.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { amountToCents } from '@/sad-aml-shared/utils/helpers/money';
import { useAttachments } from '@/utils/hooks/useAttachments';
import styles from './IncomeDialog.module.scss';

const FORM_ID = 'income-form';

type IncomeFields = Omit<IncomeItemData, 'attachments'>;
type IncomeErrors = Partial<Record<keyof IncomeFields, string>>;

const EMPTY: IncomeFields = { type: '', amount: '', justification: '' };

/**
 * Valida el formulario de un ingreso adicional. Tipo, monto y justificacion
 * son obligatorios (Figma, nodo 43121:5766: los tres llevan asterisco); los
 * adjuntos no llevan asterisco, pero el texto del modal pide adjuntarlos.
 */
export const validateIncomeItem = (values: IncomeFields): IncomeErrors => {
  const errors: IncomeErrors = {};
  if (!values.type) errors.type = 'El tipo de ingreso es requerido';
  // Con MoneyInput solo puede faltar escribir el monto (0.00 es valido).
  if (amountToCents(values.amount) === null) {
    errors.amount = 'El monto es requerido';
  }
  if (!values.justification.trim()) {
    errors.justification = 'La justificación es requerida';
  }
  return errors;
};

// Un archivo "seleccionado" o subiendo NO es un archivo subido (D-05): no se
// puede guardar el ingreso hasta que termine, y uno con error se quita o se
// reintenta, no se descarta en silencio.
const attachmentsError = (files: AttachmentFile[]): string | undefined => {
  if (files.some(f => f.status === 'selected' || f.status === 'uploading')) {
    return 'Espere a que terminen de subir los archivos';
  }
  if (files.some(f => f.status === 'error' || f.status === 'invalid')) {
    return 'Quite o reintente los archivos con error antes de continuar';
  }
  return undefined;
};

interface IncomeFormProps {
  item?: IncomeItem;
  onSave: (data: IncomeItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado y los adjuntos se
// descartan y la fila original no se altera.
const IncomeForm = ({ item, onSave }: IncomeFormProps) => {
  const types = toDropdownOptions(useCatalog('incomeTypes'));
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<IncomeFields>(
    item
      ? {
          type: item.type,
          amount: item.amount,
          justification: item.justification,
        }
      : EMPTY
  );
  const [errors, setErrors] = useState<IncomeErrors>({});
  const [attempted, setAttempted] = useState(false);
  const { files, addFiles, remove, retry } = useAttachments({
    initialFileNames: item?.attachments,
  });

  const update = (patch: Partial<IncomeFields>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateIncomeItem(next));
  };

  const fileError = attempted ? attachmentsError(files) : undefined;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateIncomeItem(state);
    if (Object.keys(found).length > 0 || attachmentsError(files)) {
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
      type: state.type,
      amount: state.amount,
      justification: state.justification.trim(),
      attachments: files.map(file => file.name),
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.income__form}
      onSubmit={handleSubmit}
    >
      <p className={`${styles.income__text} ${styles.income__full}`}>
        Informe a su jefatura inmediatamente la naturaleza de los ingresos
        adicionales, detalle de dónde provienen los fondos y adjunte en el botón
        (seleccionar archivo) los documentos en PDF que respalden la información
        suministrada.
      </p>
      <Dropdown
        label="Tipo de ingreso *"
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
      <div className={styles.income__full}>
        <Textarea
          label="Justificación *"
          maxLength={FIELD_MAX_LENGTH.address}
          value={state.justification}
          errors={errors.justification}
          onChange={event => update({ justification: event.target.value })}
        />
      </div>
      <div className={styles.income__full}>
        <FileUpload
          label="Adjuntar documentos de respaldo"
          files={files}
          onFilesSelected={addFiles}
          onRemove={remove}
          onRetry={retry}
          errors={fileError}
        />
      </div>
      <p className={`${styles.income__text} ${styles.income__full}`}>
        <strong>Recuerde:</strong> Si durante el proceso de declaración
        patrimonial identifica ingresos adicionales a su salario o cambios en su
        perfil transaccional, debe actualizar su matrícula de cliente y de ser
        requerido, presentar la documentación de respaldo de origen de fondos
        correspondiente.
      </p>
    </form>
  );
};

interface IncomeDialogProps {
  open: boolean;
  /** Ingreso que se edita; sin el, el modal es para agregar uno nuevo. */
  item?: IncomeItem;
  onSave: (data: IncomeItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Ingresos adicionales» (DEC-009C, nodos Figma 43121:5766 sin adjuntos
 * y 43121:5788 con adjuntos: es el mismo modal). Usa AppDialog
 * (dialogo estandar de DecPat, DEC-002G). El texto de la accion es
 * «Agregar» (Figma) al crear y «Guardar» al editar.
 */
const IncomeDialog = ({ open, item, onSave, onClose }: IncomeDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="xl"
    title="Ingresos adicionales"
    srDescription="Complete los datos del ingreso adicional. Los campos con asterisco son obligatorios."
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
    <IncomeForm item={item} onSave={onSave} />
  </AppDialog>
);

export default IncomeDialog;
