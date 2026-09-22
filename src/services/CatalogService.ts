// Catalogos de los Select del sistema (D-09, `preparacion-tecnica-visual.md`
// seccion 8): el usuario confirmo el 2026-09-22 que los catalogos reales
// (backend) todavia no estan definidos. Estas listas son sinteticas,
// pensadas para reemplazarse sin tocar los componentes que las consumen:
// - Estado civil: categorias genericas, no especificas de Grupo Mutual.
// - Agencia: nombres deliberadamente falsos ("Agencia 1"...); NO se
//   inventan nombres reales de sucursales de Grupo Mutual.

export interface CatalogOption {
  value: string;
  label: string;
}

export const MARITAL_STATUS_OPTIONS: CatalogOption[] = [
  { value: 'soltero', label: 'Soltero(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viudo', label: 'Viudo(a)' },
  { value: 'union_libre', label: 'Unión libre' },
];

export const AGENCY_OPTIONS: CatalogOption[] = [
  { value: 'agencia-1', label: 'Agencia 1 (mock)' },
  { value: 'agencia-2', label: 'Agencia 2 (mock)' },
  { value: 'agencia-3', label: 'Agencia 3 (mock)' },
];
