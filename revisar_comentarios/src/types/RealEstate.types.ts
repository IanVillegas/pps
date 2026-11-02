// Paso 4, Bienes inmuebles
export interface RealEstateItem {
  id: string;
  fincaNumber: string;
  location: string;
  /** Valor de mercado en digitos, sin separadores (ver utils/money.ts) */
  marketValue: string;
  /** Valor del catalogo de destino */
  destination: string;
  /** Texto libre compra/donacion/herencia/otros */
  acquisitionForm: string;
}

/** Datos del formulario de un inmueble, sin el identificador */
export type RealEstateItemData = Omit<RealEstateItem, 'id'>;

/** Valores del paso 4 dentro del borrador */
export interface RealEstateValues {
  properties?: RealEstateItem[];
}
