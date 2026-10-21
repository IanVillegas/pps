'use client';

import type { ChangeEvent } from 'react';
import { InputText } from '@/components/Atoms';
import CurrencyIcon from '@/components/Atoms/CurrencyIcon/CurrencyIcon';
import {
  amountToCents,
  centsToAmount,
  formatCents,
  MAX_AMOUNT_DIGITS,
} from '@/utils/money';

interface MoneyInputProps {
  label: string;
  /**
   * Moneda del monto ('colones' o 'dolares'): decide el icono que va al
   * inicio del campo. `undefined` = todavia no se elige en el selector (el
   * espacio del icono queda reservado); `null` = a este monto no le aplica una
   * moneda concreta (ni icono ni espacio).
   */
  currency?: string | null;
  /** Monto guardado con dos decimales («1234.56»), o '' mientras no se escribe. */
  value: string;
  onChange: (value: string) => void;
  errors?: string;
  id?: string;
}

/**
 * Campo de monto con el formato estandar de Grupo Mutual (confirmado por
 * Oldemar): se muestra con comas y siempre dos decimales, y cada digito que se
 * escribe entra por la derecha como centavos —1 se ve 0.01, luego 12 se ve
 * 0.12, 123 se ve 1.23, y asi—, para tener siempre el control de los
 * decimales. Borrar quita el ultimo digito. El placeholder es el ejemplo
 * «0,000.00» y el icono de la moneda va al inicio del campo.
 *
 * El valor que sube es un texto decimal («1234.56»); un monto entero heredado
 * («1500000») se lee como 1,500,000.00. Se aceptan hasta 15 digitos con los
 * centavos.
 */
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
    // Un digito de mas se ignora: el campo se queda como estaba.
    if (digits.length > MAX_AMOUNT_DIGITS) return;
    const typed = digits === '' ? 0 : Number(digits);
    // Si al borrar solo quedan ceros, el campo vuelve a estar vacio (si no,
    // «0.00» no se podria quitar).
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
      // cambia de estructura al elegirla y el texto no «salta».
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
