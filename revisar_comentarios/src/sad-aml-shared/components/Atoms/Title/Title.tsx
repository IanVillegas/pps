import React from 'react';
import styles from './Title.module.scss';
import type { TitleProps } from '@/sad-aml-shared/components/Atoms/Title/Title.type';

const Title = ({ text, className }: TitleProps) => {
  return (
    <h2 className={className ? (styles[className] ?? className) : styles.title}>
      {text}
    </h2>
  );
};

export default Title;
