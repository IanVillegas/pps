// Paso 11, Datos judiciales
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
  /** "¿A quien?": obligatorio mientras la pension esta en "Sí". */
  alimonyTo?: string;
  /** "Monto que cancela por mes", en digitos: obligatorio mientras la pension esta en "Sí". */
  alimonyAmount?: string;
}
