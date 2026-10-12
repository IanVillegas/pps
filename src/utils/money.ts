// Formato de montos SIMBOLICO: separador de miles con coma, sin decimales,
// tomado tal cual del placeholder de Figma ("0,000,000", nodo 43121:5271).
// D-10 (preparacion-tecnica-visual.md) sigue abierta para las reglas reales
// de formato, redondeo y moneda (colones/dolares); esto es solo para no
// mostrar un numero plano mientras tanto.
export const formatAmount = (value: string | number): string => {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  }
  if (!/^\d+$/.test(value)) return value;
  return Number(value).toLocaleString('en-US');
};

// Saldo mensual y razones del paso 3, tal como los dibuja Figma
// ("₡ 1,897.45" y "0.00 %", nodos 43121:5733 y 43121:5731). Mismo caracter
// provisional que formatAmount: el formato real depende de D-10.
export const formatCurrency = (value: number, symbol = '₡'): string =>
  `${symbol} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatPercent = (value: number): string => `${value.toFixed(2)} %`;
