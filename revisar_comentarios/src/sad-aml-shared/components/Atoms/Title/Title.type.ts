import type { TitleEnum } from '@/sad-aml-shared/types/enum/Title.enum';
import type { ReactNode } from 'react';

export type TitleProps = {
  text?: string | ReactNode | null;
  width?: string;
  className?: TitleEnum | string;
};
