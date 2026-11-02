import type { JSX } from 'react';
import { Constants } from '@/sad-aml-shared/utils/Enums';

export const includesErrorString = (text?: string | JSX.Element | null) => {
  return (
    text &&
    (text.toString().toLocaleUpperCase().includes(Constants.WRONG_UPPER) ||
      text.toString().toLocaleUpperCase().includes(Constants.ERROR))
  );
};

export const hideModalTitle = (text?: string | JSX.Element | null) => {
  return (
    text &&
    (includesErrorString(text) ||
      text.toString() === Constants.IMPORTANT ||
      text.toString() === Constants.ATTENTION)
  );
};
