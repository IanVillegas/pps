// Formato de montos SIMBOLICO: separador de miles con coma, sin decimales
// sigue abierta para las reglas reales
// de formato, redondeo y moneda (colones/dolares); esto es solo para no
// mostrar un numero plano MIENTRAS tanto
export const formatAmount = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (/^\d+\.\d{2}$/.test(value)) {
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (!/^\d+$/.test(value)) return value;
  return Number(value).toLocaleString('en-US');
};

export const MAX_AMOUNT_DIGITS = 15;

/** Centavos de un monto guardado ("1234.56" o "1500000"); null si no es un monto */
export const amountToCents = (value: string): number | null => {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) return null;
  const cents =
    Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
};

/** Texto guardado de unos centavos: 123456 -> "1234.56" */
export const centsToAmount = (cents: number): string =>
  `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;

/** Centavos con comas y dos decimales, sin simbolo: 123456 -> "1,234.56" */
export const formatCents = (cents: number): string =>
  // Entero y centavos por separado: dividir entre 100 en flotante perderia
  // precision con los montos de 15 digitos
  `${Math.floor(cents / 100).toLocaleString('en-US')}.${String(cents % 100).padStart(2, '0')}`;

// Saldo mensual y razones del paso 3
export const formatCurrency = (value: number, symbol = '₡'): string =>
  `${symbol} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatPercent = (value: number): string => `${value.toFixed(2)} %`;
