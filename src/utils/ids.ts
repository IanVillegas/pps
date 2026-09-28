let counter = 0;

/**
 * Identificador unico para filas creadas en el cliente. No es un id de
 * backend: cuando exista el contrato, el servidor lo asigna o lo reemplaza.
 */
export const createId = (): string => {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};
