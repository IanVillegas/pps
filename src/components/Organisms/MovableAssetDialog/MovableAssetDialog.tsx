'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Button, ButtonColor, InputText, Textarea } from '@/components/Atoms';
import { Dropdown } from '@/components/Molecules';
import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import Tooltip from '@/sad-aml-shared/components/Atoms/Tooltip/Tooltip';
import {
  MOVABLE_ASSET_BRAND_OPTIONS,
  MOVABLE_ASSET_TYPE_OPTIONS,
} from '@/services/CatalogService';
import type {
  MovableAssetItem,
  MovableAssetItemData,
} from '@/types/MovableAsset.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import styles from './MovableAssetDialog.module.scss';

const FORM_ID = 'movable-asset-form';

const TYPES = MOVABLE_ASSET_TYPE_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));
const BRANDS = MOVABLE_ASSET_BRAND_OPTIONS.map(option => ({
  value: option.value,
  element: option.label,
}));

type MovableAssetErrors = Partial<Record<keyof MovableAssetItemData, string>>;

const EMPTY: MovableAssetItemData = {
  type: '',
  brand: '',
  plate: '',
  year: '',
  marketValue: '',
  description: '',
  observation: '',
};

const CURRENT_YEAR = new Date().getFullYear();
// Rango simbolico (sin contrato de backend, mismo criterio que fieldLimits.ts):
// el vehiculo mas viejo razonable y un margen de un año hacia adelante
// (compras del año entrante, ej. fin de diciembre).
const MIN_YEAR = 1900;
const MAX_YEAR = CURRENT_YEAR + 1;

/**
 * Valida el formulario de un bien mueble. Todos los campos son obligatorios
 * (Figma, nodo 43121:4486: los siete llevan asterisco).
 */
export const validateMovableAssetItem = (
  values: MovableAssetItemData
): MovableAssetErrors => {
  const errors: MovableAssetErrors = {};
  if (!values.type) errors.type = 'El tipo de bien mueble es requerido';
  if (!values.brand) errors.brand = 'La marca es requerida';
  if (!values.plate.trim()) errors.plate = 'El número de placa es requerido';

  if (!values.year.trim()) {
    errors.year = 'El año es requerido';
  } else if (
    !/^\d+$/.test(values.year) ||
    Number(values.year) < MIN_YEAR ||
    Number(values.year) > MAX_YEAR
  ) {
    errors.year = `Escriba un año entre ${MIN_YEAR} y ${MAX_YEAR}`;
  }

  if (!values.marketValue.trim()) {
    errors.marketValue = 'El valor de mercado es requerido';
  } else if (!/^\d+$/.test(values.marketValue)) {
    errors.marketValue = 'Escriba solo números';
  }

  if (!values.description.trim()) {
    errors.description = 'La descripción es requerida';
  }
  if (!values.observation.trim()) {
    errors.observation = 'La observación es requerida';
  }
  return errors;
};

interface MovableAssetFormProps {
  item?: MovableAssetItem;
  onSave: (data: MovableAssetItemData) => void;
}

// Vive dentro del contenido del modal, que Radix solo monta mientras esta
// abierto: al cerrar (Cancelar, X, Escape) el estado se descarta y la fila
// original no se altera; al abrir de nuevo parte limpio o con la fila.
const MovableAssetForm = ({ item, onSave }: MovableAssetFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<MovableAssetItemData>(item ?? EMPTY);
  const [errors, setErrors] = useState<MovableAssetErrors>({});
  const [attempted, setAttempted] = useState(false);

  const update = (patch: Partial<MovableAssetItemData>) => {
    const next = { ...state, ...patch };
    setState(next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (attempted) setErrors(validateMovableAssetItem(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // El modal va en un portal, pero React propaga los eventos por el arbol
    // de componentes: sin esto el submit tambien llegaria al formulario del
    // wizard y avanzaria de paso.
    event.stopPropagation();
    const found = validateMovableAssetItem(state);
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
      type: state.type,
      brand: state.brand,
      plate: state.plate.trim(),
      year: state.year,
      marketValue: state.marketValue,
      description: state.description.trim(),
      observation: state.observation.trim(),
    });
  };

  return (
    <form
      id={FORM_ID}
      ref={formRef}
      noValidate
      className={styles.movableAsset__form}
      onSubmit={handleSubmit}
    >
      <Dropdown
        label="Tipo de bien mueble *"
        placeholder="Selecciona"
        options={TYPES}
        value={state.type || undefined}
        errors={errors.type}
        onChange={value => update({ type: value })}
      />
      <Dropdown
        label="Marca del bien mueble *"
        placeholder="Selecciona"
        options={BRANDS}
        value={state.brand || undefined}
        errors={errors.brand}
        onChange={value => update({ brand: value })}
      />
      <InputText
        label="Descripción *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.location}
        value={state.description}
        errors={errors.description}
        onChange={event => update({ description: event.target.value })}
        tooltip={
          // Figma (nodo 43121:4494) pone el "?" junto a la etiqueta; InputText
          // solo tiene un slot de tooltip despues del campo (ver
          // InputText.tsx). Se usa ese slot para no tocar el componente
          // compartido por una diferencia de posicion, no de contenido.
          <Tooltip
            content="Incluya marca, modelo y demás características que permitan identificar el bien."
            side="right"
          >
            <button
              type="button"
              className={styles.movableAsset__help}
              aria-label="Ayuda sobre Descripción"
            >
              <i className="ri-question-line" aria-hidden="true" />
            </button>
          </Tooltip>
        }
      />
      <InputText
        label="Número de placa *"
        placeholder="Escribe aquí"
        maxLength={FIELD_MAX_LENGTH.fincaNumber}
        value={state.plate}
        errors={errors.plate}
        onChange={event => update({ plate: event.target.value })}
      />
      <InputText
        label="Año *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={4}
        value={state.year}
        errors={errors.year}
        onChange={event =>
          update({ year: event.target.value.replace(/\D/g, '') })
        }
      />
      <InputText
        label="Valor de mercado *"
        placeholder="Escribe aquí"
        inputMode="numeric"
        maxLength={FIELD_MAX_LENGTH.amount}
        value={state.marketValue}
        errors={errors.marketValue}
        onChange={event =>
          update({ marketValue: event.target.value.replace(/\D/g, '') })
        }
      />
      <div className={styles.movableAsset__full}>
        <Textarea
          label="Observación *"
          placeholder="Escribe aquí"
          maxLength={FIELD_MAX_LENGTH.address}
          value={state.observation}
          errors={errors.observation}
          onChange={event => update({ observation: event.target.value })}
        />
      </div>
    </form>
  );
};

interface MovableAssetDialogProps {
  open: boolean;
  /** Bien mueble que se edita; sin el, el modal es para agregar uno nuevo. */
  item?: MovableAssetItem;
  onSave: (data: MovableAssetItemData) => void;
  onClose: () => void;
}

/**
 * Modal «Datos del bien mueble» (DEC-011, nodo Figma 43121:4486). Usa Modal
 * de sad-aml-shared, mismo patron que FamilyDialog/RealEstateDialog. El
 * texto de la accion es «Agregar» (Figma) al crear y «Guardar» al editar
 * (Figma solo dibuja el alta).
 */
const MovableAssetDialog = ({
  open,
  item,
  onSave,
  onClose,
}: MovableAssetDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    className={styles.movableAsset}
    title="Datos del bien mueble"
    description="Complete los datos del bien mueble. Los campos con asterisco son obligatorios."
    classNameDescription={styles.movableAsset__description}
    contentCard={<MovableAssetForm item={item} onSave={onSave} />}
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

export default MovableAssetDialog;
