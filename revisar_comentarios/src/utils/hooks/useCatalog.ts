// [INTEGRACION] Lectura de catalogos: no cambia al conectar el backend
import { useSyncExternalStore } from 'react';
import {
  getCatalog,
  getCatalogStatus,
  loadCatalogs,
  subscribeCatalogs,
  type CatalogName,
  type CatalogOption,
} from '@/services/CatalogService';

/** Opciones de un catalogo; la pantalla se vuelve a dibujar cuando llegan */
export const useCatalog = (name: CatalogName): CatalogOption[] =>
  useSyncExternalStore(
    subscribeCatalogs,
    () => getCatalog(name),
    () => getCatalog(name)
  );

export const useCatalogs = () => {
  const status = useSyncExternalStore(
    subscribeCatalogs,
    getCatalogStatus,
    getCatalogStatus
  );
  return { status, retry: loadCatalogs };
};
