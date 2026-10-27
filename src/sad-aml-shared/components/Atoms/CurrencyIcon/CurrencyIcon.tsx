// Iconos de moneda de Figma (nodos «Ico / money-colones» e «Ico / money-2»,
// 20x20, rojo #D23D3D): el colon y el dolar. Los trazos son los de los SVG de
// Figma, en linea porque el proyecto no importa SVG como archivos (ver
// src/assets/images).
const COLONES_PATH =
  'M9.85 15.622C9.406 15.61 8.986 15.544 8.59 15.424L8.266 17.044H6.952L7.366 14.992C6.442 14.512 5.758 13.81 5.314 12.886C4.87 11.962 4.648 10.864 4.648 9.592C4.648 8.536 4.84 7.594 5.224 6.766C5.608 5.926 6.172 5.242 6.916 4.714C7.672 4.174 8.584 3.838 9.652 3.706L9.94 2.338H11.254L10.984 3.634C11.428 3.658 11.854 3.712 12.262 3.796L12.55 2.338H13.864L13.504 4.12C13.672 4.18 13.834 4.246 13.99 4.318C14.158 4.378 14.32 4.444 14.476 4.516L13.612 6.676C13.516 6.616 13.42 6.568 13.324 6.532C13.228 6.496 13.132 6.454 13.036 6.406L11.614 13.39C11.998 13.342 12.382 13.264 12.766 13.156C13.162 13.048 13.576 12.916 14.008 12.76V14.974C13.108 15.358 12.16 15.574 11.164 15.622L10.876 17.044H9.562L9.85 15.622ZM11.812 5.974C11.632 5.914 11.452 5.878 11.272 5.866C11.092 5.842 10.936 5.83 10.804 5.83H10.534L9.058 13.12C9.238 13.204 9.43 13.27 9.634 13.318C9.85 13.366 10.072 13.402 10.3 13.426L11.812 5.974ZM9.166 6.136C8.578 6.412 8.128 6.85 7.816 7.45C7.504 8.038 7.348 8.758 7.348 9.61C7.348 10.15 7.396 10.636 7.492 11.068C7.588 11.488 7.738 11.854 7.942 12.166L9.166 6.136Z';
const DOLLAR_PATH =
  'M5.33333 12.6667H12.6667C12.8435 12.6667 13.013 12.5964 13.1381 12.4714C13.2631 12.3464 13.3333 12.1768 13.3333 12C13.3333 11.8232 13.2631 11.6536 13.1381 11.5286C13.013 11.4036 12.8435 11.3333 12.6667 11.3333H7.33333C6.44928 11.3333 5.60143 10.9821 4.97631 10.357C4.35119 9.7319 4 8.88406 4 8C4 7.11594 4.35119 6.2681 4.97631 5.64298C5.60143 5.01786 6.44928 4.66667 7.33333 4.66667H8.66667V2H11.3333V4.66667H14.6667V7.33333H7.33333C7.15652 7.33333 6.98695 7.40357 6.86193 7.52859C6.7369 7.65362 6.66667 7.82319 6.66667 8C6.66667 8.17681 6.7369 8.34638 6.86193 8.47141C6.98695 8.59643 7.15652 8.66667 7.33333 8.66667H12.6667C13.5507 8.66667 14.3986 9.01786 15.0237 9.64298C15.6488 10.2681 16 11.1159 16 12C16 12.8841 15.6488 13.7319 15.0237 14.357C14.3986 14.9821 13.5507 15.3333 12.6667 15.3333H11.3333V18H8.66667V15.3333H5.33333V12.6667Z';

interface CurrencyIconProps {
  /** Valor del catalogo de moneda: 'colones' o 'dolares'. */
  currency: string;
  /** Lado en px; Figma los dibuja de 20. */
  size?: number;
}

/**
 * Icono de la moneda (colon o dolar). Es decorativo: el nombre de la moneda
 * siempre va escrito al lado (en el selector, en el titulo de los totales),
 * asi que no se anuncia. Una moneda desconocida no dibuja nada.
 */
const CurrencyIcon = ({ currency, size = 20 }: CurrencyIconProps) => {
  const path =
    currency === 'colones'
      ? COLONES_PATH
      : currency === 'dolares'
        ? DOLLAR_PATH
        : null;
  if (!path) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} fill="#D23D3D" />
    </svg>
  );
};

export default CurrencyIcon;
