let counter = 0;

/**
 * Identificador único para filas creadas. No es un id de
 * backend, cuando exista, el servidor lo asignará o reemplazará
 *
 * * Se usa en Family.tsx, esto es porque digamos que se agrega un famuliar, este familiar no tiene
 * * ID porque no tenemos BD, pero el sistema sí necesita un ID para reconocerlo en cada fila
 */
export const createId = (): string => {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};
