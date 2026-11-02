// Paso 5, Bienes muebles
export interface MovableAssetItem {
  /** Identificador estable de la fila */
  id: string;
  /** Valor del catalogo/dropdown de tipo de bien mueble */
  type: string;
  /** Valor del catalogo de marca  */
  brand: string;
  plate: string;
  year: string;
  /** Valor de mercado en digitos, sin separadores (utils/money.ts) */
  marketValue: string;
  description: string;
  observation: string;
}

/** Datos del formulario de un bien mueble, sin el identificador */
export type MovableAssetItemData = Omit<MovableAssetItem, 'id'>;

/** Valores del paso 5 dentro del borrador */
export interface MovableAssetValues {
  items?: MovableAssetItem[];
}
