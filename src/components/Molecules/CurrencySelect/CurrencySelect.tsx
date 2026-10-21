'use client';

import * as Select from '@radix-ui/react-select';
import Dropdown from '@/sad-aml-shared/components/Molecules/Dropdown/Dropdown';
import CurrencyIcon from '@/components/Atoms/CurrencyIcon/CurrencyIcon';
import { CURRENCY_OPTIONS } from '@/services/CatalogService';
import styles from './CurrencySelect.module.scss';

interface CurrencySelectProps {
  label: string;
  /** Moneda elegida ('colones' o 'dolares'); undefined mientras no se elige. */
  value?: string;
  onChange: (value: string) => void;
  errors?: string;
  id?: string;
}

// Cada opcion lleva el icono de su moneda delante del nombre. El texto va
// dentro de `Select.ItemText` para que el icono tambien se vea en el campo
// cerrado, junto a la moneda elegida (Dropdown solo lo hace por si mismo con
// opciones de texto plano).
const OPTIONS = CURRENCY_OPTIONS.map(option => ({
  value: option.value,
  element: (
    <Select.ItemText>
      <span className={styles.currencySelect__option}>
        <CurrencyIcon currency={option.value} />
        {option.label}
      </span>
    </Select.ItemText>
  ),
}));

/**
 * Selector de moneda de los montos (colones o dolares), con el icono de la
 * moneda en cada opcion y en la elegida. Se coloca ANTES del monto: lo que
 * se elige aqui decide el icono que lleva el campo de monto (MoneyInput).
 */
const CurrencySelect = ({
  label,
  value,
  onChange,
  errors,
  id,
}: CurrencySelectProps) => (
  <Dropdown
    id={id}
    label={label}
    placeholder="Selecciona"
    options={OPTIONS}
    value={value}
    errors={errors}
    onChange={onChange}
  />
);

export default CurrencySelect;
