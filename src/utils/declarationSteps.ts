import type { DeclarationStep } from '@/types/DeclarationStep.types';

// Titulos tomados del encabezado de cada pantalla en Figma (archivo DecPat,
// nodos 43121:6243 a 43121:1459). El paso 12 lleva en Figma el titulo
// "Declaracion patrimonial completa" aunque su contenido es el cuestionario
// confidencial; se conserva literal hasta confirmarlo (ver DEC-018A).
export const DECLARATION_STEPS: readonly DeclarationStep[] = [
  { id: 1, title: 'Datos generales' },
  { id: 2, title: 'Conformación del núcleo familiar' },
  { id: 3, title: 'Ingresos y egresos' },
  { id: 4, title: 'Bienes inmuebles' },
  { id: 5, title: 'Bienes muebles' },
  { id: 6, title: 'Datos económicos' },
  { id: 7, title: 'Cuentas corrientes' },
  { id: 8, title: 'Créditos que posee' },
  { id: 9, title: 'Tarjetas de crédito' },
  { id: 10, title: 'Personería jurídica' },
  { id: 11, title: 'Datos judiciales' },
  { id: 12, title: 'Declaración patrimonial completa' },
];
