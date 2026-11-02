// ! [SIMULADO] Las listas de este archivo son datos de demostracion: reemplazarlas por los catalogos del servidor

import { apiRequest, isMockMode } from '@/services/api/apiClient';

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

export const REAL_ESTATE_DESTINATION_OPTIONS: CatalogOption[] = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'uso-comercial', label: 'Uso comercial' },
  { value: 'lote-sin-construir', label: 'Lote sin construir' },
  { value: 'otro', label: 'Otro' },
];

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

// Tipos del paso 3 (Ingresos y egresos)
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

// Paso 6 (cuentas de ahorro)
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
  { value: 'banco-1', label: 'Banco 1' },
  { value: 'banco-2', label: 'Banco 2' },
  { value: 'cooperativa', label: 'Cooperativa' },
  { value: 'otra', label: 'Otra' },
];

// Tipo de sociedad del paso 10
export const SOCIETY_TYPE_OPTIONS: CatalogOption[] = [
  { value: 'sociedad-anonima', label: 'Sociedad anónima' },
  {
    value: 'sociedad-responsabilidad-limitada',
    label: 'Sociedad de responsabilidad limitada',
  },
];

// ! [INTEGRACION] --- Carga asincrona de los catalogos (DEC-019A) ---
// Las listas de arriba son los datos SIMULADOS. En modo simulado (sin
// NEXT_PUBLIC_API_BASE_URL) los catalogos estan disponibles desde el primer
// render; con API real se piden al backend (`GET /catalogs/{nombre}` contrato, seccion 4)
// al entrar a las pantallas internas, con error y reintento. Las
// pantallas no importan las listas: leen el catalogo por nombre con
// `useCatalog` / `catalogLabel`, asi cambiar de simulado a real no las toca

export type CatalogName =
  | 'maritalStatus'
  | 'agencies'
  | 'relationships'
  | 'genders'
  | 'realEstateDestinations'
  | 'movableAssetTypes'
  | 'movableAssetBrands'
  | 'incomeTypes'
  | 'expenseTypes'
  | 'accountRelationships'
  | 'currencies'
  | 'financialEntities'
  | 'societyTypes';

/** Ruta del catalogo en la API (contrato, seccion 4) */
const CATALOG_PATHS: Record<CatalogName, string> = {
  maritalStatus: 'marital-status',
  agencies: 'agencies',
  relationships: 'relationships',
  genders: 'genders',
  realEstateDestinations: 'real-estate-destinations',
  movableAssetTypes: 'movable-asset-types',
  movableAssetBrands: 'movable-asset-brands',
  incomeTypes: 'income-types',
  expenseTypes: 'expense-types',
  accountRelationships: 'account-relationships',
  currencies: 'currencies',
  financialEntities: 'financial-entities',
  societyTypes: 'society-types',
};

const CATALOG_NAMES = Object.keys(CATALOG_PATHS) as CatalogName[];

const MOCK_CATALOGS: Record<CatalogName, CatalogOption[]> = {
  maritalStatus: MARITAL_STATUS_OPTIONS,
  agencies: AGENCY_OPTIONS,
  relationships: RELATIONSHIP_OPTIONS,
  genders: GENDER_OPTIONS,
  realEstateDestinations: REAL_ESTATE_DESTINATION_OPTIONS,
  movableAssetTypes: MOVABLE_ASSET_TYPE_OPTIONS,
  movableAssetBrands: MOVABLE_ASSET_BRAND_OPTIONS,
  incomeTypes: INCOME_TYPE_OPTIONS,
  expenseTypes: EXPENSE_TYPE_OPTIONS,
  accountRelationships: ACCOUNT_RELATIONSHIP_OPTIONS,
  currencies: CURRENCY_OPTIONS,
  financialEntities: FINANCIAL_ENTITY_OPTIONS,
  societyTypes: SOCIETY_TYPE_OPTIONS,
};

/**
 * `ready`: hay catalogos para usar (los simulados o los del servidor);
 * `loading`: se estan pidiendo; `error`: alguno no llego (se puede reintentar,
 * los que si llegaron se conservan)
 */
export type CatalogStatus = 'ready' | 'loading' | 'error';

let catalogs: Record<CatalogName, CatalogOption[]> = MOCK_CATALOGS;
let catalogStatus: CatalogStatus = 'ready';
// Cada carga nueva invalida a la anterior: una respuesta vieja no pisa a otra
let catalogLoad = 0;
const catalogListeners = new Set<() => void>();

const publishCatalogs = (
  nextCatalogs: Record<CatalogName, CatalogOption[]>,
  nextStatus: CatalogStatus
) => {
  catalogs = nextCatalogs;
  catalogStatus = nextStatus;
  catalogListeners.forEach(listener => listener());
};

export const getCatalog = (name: CatalogName): CatalogOption[] =>
  catalogs[name];
export const getCatalogStatus = () => catalogStatus;
export const subscribeCatalogs = (listener: () => void) => {
  catalogListeners.add(listener);
  return () => {
    catalogListeners.delete(listener);
  };
};

/** Opciones en el formato del Dropdown compartido (`element` es el texto) */
export const toDropdownOptions = (options: CatalogOption[]) =>
  options.map(option => ({ value: option.value, element: option.label }));

/** Texto de un valor de catalogo; si ya no existe, el propio valor */
export const catalogLabel = (name: CatalogName, value: string): string =>
  catalogs[name].find(option => option.value === value)?.label ?? value;

/**
 * Pide los catalogos. En modo simulado no hace nada (ya estan disponibles).
 * Con API real pide los trece en paralelo; los que fallan dejan el estado en
 * `error` sin perder los que si llegaron, y volver a llamarla reintenta
 */
export const loadCatalogs = async (): Promise<void> => {
  if (isMockMode()) return;
  const load = ++catalogLoad;
  publishCatalogs(catalogs, 'loading');
  const results = await Promise.allSettled(
    CATALOG_NAMES.map(name =>
      apiRequest<CatalogOption[]>('GET', `/catalogs/${CATALOG_PATHS[name]}`)
    )
  );
  if (load !== catalogLoad) return;
  const next = { ...catalogs };
  let failed = false;
  results.forEach((result, index) => {
    if (result.status === 'fulfilled')
      next[CATALOG_NAMES[index]] = result.value;
    else failed = true;
  });
  publishCatalogs(next, failed ? 'error' : 'ready');
};

/** Vuelve a los catalogos simulados (cierre de sesion y pruebas) */
export const resetCatalogs = () => {
  catalogLoad += 1;
  publishCatalogs(MOCK_CATALOGS, 'ready');
};
