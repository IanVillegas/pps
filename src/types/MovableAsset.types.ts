// Paso 5, Bienes muebles (nodos Figma 43121:4527 y 43121:4486).
export interface MovableAssetItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  /** Valor del catalogo de tipo de bien mueble (D-09: sintetico). */
  type: string;
  /** Valor del catalogo de marca (D-09: sintetico; ver nota en CatalogService). */
  brand: string;
  plate: string;
  year: string;
  /** Valor de mercado en digitos, sin separadores (ver utils/money.ts). */
  marketValue: string;
  /** D-06: "Descripcion" es el unico campo de Figma; no existe "Modelo"
   * aparte, de ahi el tooltip que aclara que aqui tambien va el modelo. */
  description: string;
  observation: string;
}

/** Datos del formulario de un bien mueble, sin el identificador. */
export type MovableAssetItemData = Omit<MovableAssetItem, 'id'>;

/** Valores del paso 5 dentro del borrador. */
export interface MovableAssetValues {
  items?: MovableAssetItem[];
}
