import type { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import type { MouseEventHandler } from 'react';

export type IconProps = {
  name: string;
  size?: number | string;
  color?: ColorEnum | string;
  className?: string;
  ariaLabel?: string; // Para accesibilidad
  onClick?: MouseEventHandler<HTMLElement>; // Permite manejar eventos
  style?: React.CSSProperties; // Permite aplicar estilos personalizados
  text?: string;
  textStyle?: string;
};
