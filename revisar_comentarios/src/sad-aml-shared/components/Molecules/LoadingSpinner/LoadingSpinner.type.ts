import type { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import type { SizeEnum } from '@/sad-aml-shared/types/enum/Size.enum';

export interface LoadingSpinnerProps {
  text?: string;
  size?: SizeEnum;
  color?: ColorEnum;
}
