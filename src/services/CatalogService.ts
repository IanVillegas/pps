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

// Parentesco y genero del paso 2 (Familia). Mismo caso que arriba (D-09):
// listas sinteticas hasta que el backend defina los catalogos reales.
export const RELATIONSHIP_OPTIONS: CatalogOption[] = [
  { value: 'conyuge', label: 'Cónyuge' },
  { value: 'hijo', label: 'Hijo(a)' },
  { value: 'padre', label: 'Padre' },
  { value: 'madre', label: 'Madre' },
  { value: 'hermano', label: 'Hermano(a)' },
  { value: 'otro', label: 'Otro' },
];

export const GENDER_OPTIONS: CatalogOption[] = [
  { value: 'femenino', label: 'Femenino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'otro', label: 'Otro' },
];

// Destino del paso 4 (Bienes inmuebles). Mismo caso que arriba (D-09):
// lista sintetica hasta que el backend defina el catalogo real; "Vivienda"
// es el ejemplo que trae Figma (nodo 43121:5271, columna Destino).
export const REAL_ESTATE_DESTINATION_OPTIONS: CatalogOption[] = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'uso-comercial', label: 'Uso comercial' },
  { value: 'lote-sin-construir', label: 'Lote sin construir' },
  { value: 'otro', label: 'Otro' },
];

// Tipo y marca del paso 5 (Bienes muebles). Mismo caso que arriba (D-09):
// listas sinteticas hasta que el backend defina los catalogos reales.
// "Vehiculo"/"BMW" son los ejemplos que trae Figma (nodo 43121:4527, tabla).
//
// IMPORTANTE: una lista cerrada para "Marca" es poco practica en la vida
// real (hay cientos de marcas posibles entre vehiculos, joyas, equipo
// electronico, etc.). Se sigue el diseno de Figma tal cual (Dropdown-NEW
// para ambos campos, nodo 43121:4505), pero queda como algo a confirmar con
// el negocio -- lo mas probable es que termine siendo texto libre o un
// combobox que admita escribir una opcion nueva.
export const MOVABLE_ASSET_TYPE_OPTIONS: CatalogOption[] = [
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'embarcacion', label: 'Embarcación' },
  { value: 'maquinaria', label: 'Maquinaria' },
  { value: 'equipo-electronico', label: 'Equipo electrónico' },
  { value: 'joyas', label: 'Joyas' },
  { value: 'otro', label: 'Otro' },
];

export const MOVABLE_ASSET_BRAND_OPTIONS: CatalogOption[] = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'hyundai', label: 'Hyundai' },
  { value: 'bmw', label: 'BMW' },
  { value: 'otra', label: 'Otra' },
];

// Tipos del paso 3 (Ingresos y egresos). Mismo caso que arriba (D-09): listas
// sinteticas hasta que el backend defina los catalogos reales.
// IMPORTANTE: el valor 'cuotas-creditos' lo usa la simulacion del backend
// (FinancialSummaryService) para la razon cuota-ingreso; el modal de egresos
// pide anotar ahi las cuotas de creditos de Grupo Mutual (nodo Figma 43121:5323).
export const INCOME_TYPE_OPTIONS: CatalogOption[] = [
  { value: 'alquileres', label: 'Alquileres' },
  { value: 'comisiones', label: 'Comisiones' },
  { value: 'pension', label: 'Pensión' },
  { value: 'actividad-independiente', label: 'Actividad independiente' },
  { value: 'otro', label: 'Otro' },
];

export const EXPENSE_TYPE_OPTIONS: CatalogOption[] = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'alimentacion', label: 'Alimentación' },
  { value: 'servicios', label: 'Servicios públicos' },
  { value: 'educacion', label: 'Educación' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'cuotas-creditos', label: 'Cuotas de créditos' },
  { value: 'otro', label: 'Otro' },
];

// Paso 6 (cuentas de ahorro). Mismo caso que arriba (D-09): listas sinteticas
// hasta que el backend defina los catalogos reales; no se inventan nombres
// reales de entidades financieras. "Grupo Mutual" es el ejemplo que trae
// Figma en la tabla (nodo 43121:4458).
export const ACCOUNT_RELATIONSHIP_OPTIONS: CatalogOption[] = [
  { value: 'titular', label: 'Titular' },
  ...RELATIONSHIP_OPTIONS,
];

export const CURRENCY_OPTIONS: CatalogOption[] = [
  { value: 'colones', label: 'Colones' },
  { value: 'dolares', label: 'Dólares' },
];

export const FINANCIAL_ENTITY_OPTIONS: CatalogOption[] = [
  { value: 'grupo-mutual', label: 'Grupo Mutual' },
  { value: 'banco-1', label: 'Banco 1 (mock)' },
  { value: 'banco-2', label: 'Banco 2 (mock)' },
  { value: 'cooperativa', label: 'Cooperativa (mock)' },
  { value: 'otra', label: 'Otra' },
];
