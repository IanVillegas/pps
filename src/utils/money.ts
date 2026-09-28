// Formato de montos SIMBOLICO: separador de miles con coma, sin decimales,
// tomado tal cual del placeholder de Figma ("0,000,000", nodo 43121:5271).
// D-10 (preparacion-tecnica-visual.md) sigue abierta para las reglas reales
// de formato, redondeo y moneda (colones/dolares); esto es solo para no
// mostrar un numero plano mientras tanto.
export const formatAmount = (value: string): string => {
  if (!/^\d+$/.test(value)) return value;
  return Number(value).toLocaleString('en-US');
};
