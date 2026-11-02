'use client';

import type { ChangeEvent } from 'react';
import InputText from '@/sad-aml-shared/components/Atoms/InputText/InputText';
import CurrencyIcon from '@/sad-aml-shared/components/Atoms/CurrencyIcon/CurrencyIcon';
import {
  amountToCents,
  centsToAmount,
  formatCents,
  MAX_AMOUNT_DIGITS,
} from '@/sad-aml-shared/utils/helpers/money';

interface MoneyInputProps {
  label: string;
  /**
   * Moneda del monto ('colones' o 'dolares'): decide el icono que va al
   * inicio del campo. `undefined` = todavia no se elige en el selector (el
   * espacio del icono queda reservado); `null` = a este monto no le aplica una
   * moneda concreta (ni icono ni espacio)
   */
  currency?: string | null;
  /** Monto guardado con dos decimales («1234.56»), o vacio mientras no se escribe. */
  value: string;
  onChange: (value: string) => void;
  errors?: string;
  id?: string;
}

const MoneyInput = ({
  label,
  currency,
  value,
  onChange,
  errors,
  id,
}: MoneyInputProps) => {
  const cents = amountToCents(value);
  const display = cents === null ? '' : formatCents(cents);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const digits = raw.replace(/\D/g, '');
    // Un digito de mas se ignora: el campo se queda como estaba
    if (digits.length > MAX_AMOUNT_DIGITS) return;
    const typed = digits === '' ? 0 : Number(digits);
    // Si al borrar solo quedan ceros, el campo vuelve a estar vacio (si no,
    // "0.00" no se podria quitar)
    const deleting = raw.length < display.length;
    if (digits === '' || (typed === 0 && deleting)) {
      onChange('');
      return;
    }
    onChange(centsToAmount(typed));
  };

  return (
    <InputText
      id={id}
      label={label}
      placeholder="0,000.00"
      inputMode="numeric"
      autoComplete="off"
      value={display}
      errors={errors}
      // Mientras se espera la moneda se pasa el adorno vacio: asi el campo no
      // cambia de estructura al elegirla y el texto no "salta"
      startAdornment={
        currency === null ? undefined : (
          <CurrencyIcon currency={currency ?? ''} />
        )
      }
      onChange={handleChange}
    />
  );
};

export default MoneyInput;
