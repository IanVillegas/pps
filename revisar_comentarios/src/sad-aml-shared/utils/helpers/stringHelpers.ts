import type { ReactNode } from 'react';

export function split(string: string): string[] {
  return string.split('');
}

export const containsWords = (text: string, words: any[]) => {
  const pattern = words
    .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(pattern, 'i');
  return regex.test(text);
};

export const classNames = (classes: string[]) => {
  return classes.reduce(
    (prevClass, currentClass) => prevClass.concat(' ') + currentClass
  );
};

export const removeApplicationCode = (accountNumber: string) => {
  return accountNumber.replace(/BCA|BCC/g, '');
};

export const isStringElement = (element: ReactNode): element is string => {
  return typeof element === 'string' || typeof element === 'number';
};
