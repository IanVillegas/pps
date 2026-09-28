// Paso 4, Bienes inmuebles (nodos Figma 43121:4951 y 43121:4922).
export interface RealEstateItem {
  /** Identificador estable de la fila (no depende de su posicion). */
  id: string;
  fincaNumber: string;
  location: string;
  /** Valor de mercado en digitos, sin separadores (ver utils/money.ts). */
  marketValue: string;
  /** Valor del catalogo de destino (D-09: sintetico). */
  destination: string;
  /** Texto libre; Figma sugiere compra/donacion/herencia/otros como ejemplo. */
  acquisitionForm: string;
}

/** Datos del formulario de un inmueble, sin el identificador. */
export type RealEstateItemData = Omit<RealEstateItem, 'id'>;

/** Valores del paso 4 dentro del borrador. */
export interface RealEstateValues {
  properties?: RealEstateItem[];
}
