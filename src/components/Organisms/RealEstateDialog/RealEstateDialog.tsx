'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText } from '@/components/Atoms';
import { Dropdown } from '@/components/Molecules';
import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import { REAL_ESTATE_DESTINATION_OPTIONS } from '@/services/CatalogService';
import type {
  RealEstateItem,
  RealEstateItemData,
} from '@/types/RealEstate.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import styles from './RealEstateDialog.module.scss';

const FORM_ID = 'real-estate-form';
const MAX_VALUE_DIGITS = FIELD_MAX_LENGTH.amount;

const DESTINATIONS = REAL_ESTATE_DESTINATION_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));

type RealEstateErrors = Partial<Record<keyof RealEstateItemData, string>>;

const EMPTY: RealEstateItemData = {
  fincaNumber: '',
  location: '',
  marketValue: '',
  destination: '',
  acquisitionForm: '',
};

/**
 * Valida el formulario de un bien inmueble. Todos los campos son
 * obligatorios (Figma, nodo 43121:4922: los cinco llevan asterisco).
 */
export const validateRealEstateItem = (
  values: RealEstateItemData
): RealEstateErrors => {
  const errors: RealEstateErrors = {};
  if (!values.fincaNumber.trim()) {
    errors.fincaNumber = 'El número de finca es requerido';
  }
  if (!values.location.trim()) {
    errors.location = 'La ubicación es requerida';
  }
  if (!values.marketValue.trim()) {
    errors.marketValue = 'El valor de mercado es requerido';
  } else if (!/^\d+$/.test(values.marketValue)) {
    errors.marketValue = 'Escriba solo números';
  }
  if (!values.destination) errors.destination = 'El destino es requerido';
  if (!values.acquisitionForm.trim()) {
    errors.acquisitionForm = 'La forma de adquisición es requerida';
  }
  return errors;
};

interface RealEstateFormProps {
  item?: RealEstateItem;
  onSave: (data: RealEstateItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const RealEstateForm = ({ item, onSave }: RealEstateFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<RealEstateItemData>(item ?? EMPTY);
  const [errors, setErrors] = useState<RealEstateErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<RealEstateItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateRealEstateItem(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateRealEstateItem(state);
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
      fincaNumber: state.fincaNumber.trim(),
      location: state.location.trim(),
      marketValue: state.marketValue,
      destination: state.destination,
      acquisitionForm: state.acquisitionForm.trim(),
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.realEstate__form}
      onSubmit={handleSubmit}
    >
      <InputText
        label="Número de finca *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.fincaNumber}
        value={state.fincaNumber}
        errors={errors.fincaNumber}
        onChange={event => update({ fincaNumber: event.target.value })}
      />
      <InputText
        label="Ubicación *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.location}
        value={state.location}
        errors={errors.location}
        onChange={event => update({ location: event.target.value })}
      />
      <InputText
        label="Valor de mercado *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={MAX_VALUE_DIGITS}
        value={state.marketValue}
        errors={errors.marketValue}
        onChange={event =>
          update({ marketValue: event.target.value.replace(/\D/g, '') })
        }
      />
      <Dropdown
        label="Destino *"
        placeholder="Selecciona"
        options={DESTINATIONS}
        value={state.destination || undefined}
        errors={errors.destination}
        onChange={value => update({ destination: value })}
      />
      <InputText
        label="Forma de adquisición *"
        placeholder="Escribe aquí"
        caption="La forma de adquisición puede ser: compra, donación, herencia, otros."
        maxLength={FIELD_MAX_LENGTH.acquisitionForm}
        value={state.acquisitionForm}
        errors={errors.acquisitionForm}
        onChange={event => update({ acquisitionForm: event.target.value })}
      />
    </form>
  );
};

interface RealEstateDialogProps {
  open: boolean;
  /** Inmueble que se edita; sin el, el modal es para agregar uno nuevo. */
  item?: RealEstateItem;
  onSave: (data: RealEstateItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos del bien inmueble» (DEC-010, nodo Figma 43121:4922). Usa
 * Modal de sad-aml-shared, mismo patron que FamilyDialog. El texto de la
 * accion es «Agregar» (Figma) al crear y «Guardar» al editar (Figma solo
 * dibuja el alta).
 */
const RealEstateDialog = ({
  open,
  item,
  onSave,
  onClose,
}: RealEstateDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    className={styles.realEstate}
    title="Datos del bien inmueble"
    description="Complete los datos del bien inmueble. Los campos con asterisco son obligatorios."
    classNameDescription={styles.realEstate__description}
    contentCard={<RealEstateForm item={item} onSave={onSave} />}
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
          text={item ? 'Guardar' : 'Agregar'}
          color={ButtonColor.Cta}
          size="medium"
          type="submit"
          form={FORM_ID}
        />
      </>
    }
  />
);

export default RealEstateDialog;
