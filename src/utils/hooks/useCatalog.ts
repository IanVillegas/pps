// [INTEGRACION] Lectura de catalogos: no cambia al conectar el backend (ver src/services/README.md).
import { useSyncExternalStore } from 'react';
import {
  getCatalog,
  getCatalogStatus,
  loadCatalogs,
  subscribeCatalogs,
  type CatalogName,
  type CatalogOption,
} from '@/services/CatalogService';

/** Opciones de un catalogo; la pantalla se vuelve a dibujar cuando llegan. */
export const useCatalog = (name: CatalogName): CatalogOption[] =>
  useSyncExternalStore(
    subscribeCatalogs,
    () => getCatalog(name),
    () => getCatalog(name)
  );

/**
 * Estado de la carga de catalogos. Las pantallas que muestran el texto de un
 * catalogo con `catalogLabel` lo llaman para volver a dibujarse cuando llegan
 * los del servidor; el shell lo usa ademas para avisar del error y reintentar.
 */
export const useCatalogs = () => {
  const status = useSyncExternalStore(
    subscribeCatalogs,
    getCatalogStatus,
    getCatalogStatus
  );
  return { status, retry: loadCatalogs };
};
