import type { TextInformationEnum } from '@/sad-aml-shared/types/enum/TextInformation.enum';
import type { ReactNode } from 'react';

export type TextInformationProps = {
  children: ReactNode;
  className?: string;
  customClass?: TextInformationEnum | string;
};
