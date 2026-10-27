// Formato de montos SIMBOLICO: separador de miles con coma, sin decimales,
// tomado tal cual del placeholder de Figma ("0,000,000", nodo 43121:5271).
// D-10 (preparacion-tecnica-visual.md) sigue abierta para las reglas reales
// de formato, redondeo y moneda (colones/dolares); esto es solo para no
// mostrar un numero plano mientras tanto.
export const formatAmount = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  // Montos con centavos («1234.56», los que escribe MoneyInput): siempre dos
  // decimales, para ver los centavos aunque sean cero.
  if (/^\d+\.\d{2}$/.test(value)) {
    return Number(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (!/^\d+$/.test(value)) return value;
  return Number(value).toLocaleString('en-US');
};

// --- Montos escritos con centavos (MoneyInput) --------------------------
// Un monto se guarda como texto decimal con dos decimales («1234.56») para no
// perder precision con numeros flotantes; internamente se opera en centavos
// enteros. Un monto entero heredado («1500000», de los campos que todavia
// piden solo digitos) se lee como 1,500,000.00.

/** Maximo de digitos escritos, centavos incluidos (mismo tope que `amount`). */
export const MAX_AMOUNT_DIGITS = 15;

/** Centavos de un monto guardado («1234.56» o «1500000»); null si no es un monto. */
export const amountToCents = (value: string): number | null => {
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(value);
  if (!match) return null;
  const cents =
    Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  return Number.isSafeInteger(cents) ? cents : null;
};

/** Texto guardado de unos centavos: 123456 -> «1234.56». */
export const centsToAmount = (cents: number): string =>
  `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, '0')}`;

/** Centavos con comas y dos decimales, sin simbolo: 123456 -> «1,234.56». */
export const formatCents = (cents: number): string =>
  // Entero y centavos por separado: dividir entre 100 en flotante perderia
  // precision con los montos de 15 digitos.
  `${Math.floor(cents / 100).toLocaleString('en-US')}.${String(cents % 100).padStart(2, '0')}`;

// Saldo mensual y razones del paso 3, tal como los dibuja Figma
// ("₡ 1,897.45" y "0.00 %", nodos 43121:5733 y 43121:5731). Mismo caracter
// provisional que formatAmount: el formato real depende de D-10.
export const formatCurrency = (value: number, symbol = '₡'): string =>
  `${symbol} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatPercent = (value: number): string => `${value.toFixed(2)} %`;
