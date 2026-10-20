// Paso 11, Datos judiciales (nodos Figma 43121:1791 y 43121:2088).
/**
 * Valores del paso 11 dentro del borrador. Cada pregunta es un interruptor
 * (ausente equivale a «No», que es como Figma lo dibuja al abrir el paso). Los
 * campos de detalle solo existen mientras su interruptor esta en «Sí»: al
 * apagarlo se descartan para no dejar un dato que contradiga la respuesta.
 */
export interface JudicialValues {
  /** ¿Ha estado implicado en juicios por la via penal? */
  penal?: boolean;
  penalDetail?: string;
  /** ¿Ha estado implicado en juicios por la via civil? */
  civil?: boolean;
  civilDetail?: string;
  /** ¿Posee usted embargos? */
  embargoes?: boolean;
  embargoesDetail?: string;
  /** ¿Paga pension alimenticia? */
  alimony?: boolean;
  /** «¿A quien?»: obligatorio mientras la pension esta en «Sí». */
  alimonyTo?: string;
  /** «Monto que cancela por mes», en digitos: obligatorio mientras la pension esta en «Sí». */
  alimonyAmount?: string;
}
