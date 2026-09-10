import type { SubTitleEnum } from '@/sad-aml-shared/types/enum/SubTitle.enum';
import type { ReactNode } from 'react';

export type SubtitleTextProps = {
  text?: string | ReactNode | null;
  className?: SubTitleEnum | string;
};
