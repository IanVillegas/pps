'use client';

import type { ReactNode } from 'react';
import styles from './RecordsTable.module.scss';

export interface RecordsTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface RecordsTableProps<T extends { id: string }> {
  /** Nombre accesible de la tabla (se anuncia; no se ve). */
  caption: string;
  columns: RecordsTableColumn<T>[];
  rows: T[];
  /** Texto que identifica la fila en los nombres de sus acciones. */
  getRowLabel: (row: T) => string;
  onAdd?: () => void;
  addLabel?: string;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyText?: string;
}

/**
 * Tabla editable de los pasos con registros (DEC-002F; Figma, nodo
 * 43121:5909 "Paso 2.1"). Es solo presentacion: quien la usa decide que hacen
 * agregar/editar/eliminar (normalmente abrir un modal). Las filas se
 * identifican por `id` estable, no por posicion, para que editar o eliminar
 * una no reacomode el estado de las demas.
 *
 * Una tabla vacia NO es un error (D-16): muestra `emptyText` y deja agregar.
 */
const RecordsTable = <T extends { id: string }>({
  caption,
  columns,
  rows,
  getRowLabel,
  onAdd,
  addLabel = 'Agregar nuevo',
  onEdit,
  onDelete,
  emptyText = 'No existen registros',
}: RecordsTableProps<T>) => {
  const hasActions = Boolean(onEdit || onDelete);
  const columnCount = columns.length + (hasActions ? 1 : 0);

  return (
    <div className={styles.records}>
      {onAdd && (
        <div className={styles.records__toolbar}>
          <button type="button" className={styles.records__add} onClick={onAdd}>
            <i className="ri-add-line" aria-hidden="true" />
            {addLabel}
          </button>
        </div>
      )}
      {/* Region enfocable: con muchas columnas la tabla hace scroll
          horizontal dentro de si misma (no rompe la pagina) y asi se puede
          desplazar con teclado. */}
      <div
        className={styles.records__scroll}
        role="region"
        aria-label={caption}
        tabIndex={0}
      >
        <table className={styles.records__table}>
          <caption className={styles.records__caption}>{caption}</caption>
          <thead>
            <tr>
              {columns.map(column => (
                <th key={column.key} scope="col">
                  {column.header}
                </th>
              ))}
              {hasActions && (
                <th scope="col" className={styles.records__actionsHeader}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className={styles.records__empty}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map(row => {
                const label = getRowLabel(row);
                return (
                  <tr key={row.id}>
                    {columns.map(column => (
                      <td key={column.key}>{column.render(row)}</td>
                    ))}
                    {hasActions && (
                      <td className={styles.records__actions}>
                        {onEdit && (
                          <button
                            type="button"
                            aria-label={`Editar ${label}`}
                            onClick={() => onEdit(row)}
                          >
                            <i
                              className="ri-edit-box-line"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            aria-label={`Eliminar ${label}`}
                            onClick={() => onDelete(row)}
                          >
                            <i
                              className="ri-delete-bin-line"
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecordsTable;
