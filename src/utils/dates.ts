// Fechas como cadenas ISO locales (YYYY-MM-DD). Se trabaja con la cadena y no
// con `new Date('YYYY-MM-DD')`, que se interpreta en UTC y puede correr la
// fecha un dia segun la zona horaria.

const pad = (value: number) => String(value).padStart(2, '0');

/** Hoy como YYYY-MM-DD en la zona horaria local. */
export const todayIso = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/** YYYY-MM-DD -> DD/MM/YYYY; devuelve vacio si no tiene ese formato. */
export const formatIsoDate = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
};

/** Compara cadenas ISO: la fecha es posterior a hoy. */
export const isFutureIso = (iso: string): boolean => iso > todayIso();
