import type { DeclarationStep } from '@/types/DeclarationStep.types';

// Titulos tomados del encabezado de cada pantalla en Figma (archivo DecPat,
// nodos 43121:6243 a 43121:1459). El paso 12 lleva en Figma el titulo
// "Declaracion patrimonial completa" aunque su contenido es el cuestionario
// confidencial; se conserva literal hasta confirmarlo (ver DEC-018A).
// Los iconos son el equivalente en Remix Icon del icono que Figma dibuja junto
// al titulo; los pasos 6 (bolsa-dinero) y 12 (garantia) son iconos propios de
// Figma sin equivalente exacto, y el paso 3 repite el de familia en el diseno.
export const DECLARATION_STEPS: readonly DeclarationStep[] = [
  { id: 1, title: 'Datos generales', iconClass: 'ri-user-line' },
  {
    id: 2,
    title: 'Conformación del núcleo familiar',
    iconClass: 'ri-group-line',
  },
  { id: 3, title: 'Ingresos y egresos', iconClass: 'ri-group-line' },
  { id: 4, title: 'Bienes inmuebles', iconClass: 'ri-home-line' },
  { id: 5, title: 'Bienes muebles', iconClass: 'ri-roadster-line' },
  { id: 6, title: 'Datos económicos', iconClass: 'ri-wallet-3-line' },
  { id: 7, title: 'Cuentas corrientes', iconClass: 'ri-hand-coin-line' },
  {
    id: 8,
    title: 'Créditos que posee',
    iconClass: 'ri-money-dollar-circle-line',
  },
  { id: 9, title: 'Tarjetas de crédito', iconClass: 'ri-bank-card-2-line' },
  { id: 10, title: 'Personería jurídica', iconClass: 'ri-government-line' },
  { id: 11, title: 'Datos judiciales', iconClass: 'ri-auction-line' },
  {
    id: 12,
    title: 'Declaración patrimonial completa',
    iconClass: 'ri-shield-check-line',
  },
];
