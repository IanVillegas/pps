'use client';

import React from 'react';
import styles from './SubtitleText.module.scss';
import { useTranslation } from 'react-i18next';
import type { SubtitleTextProps } from '@/sad-aml-shared/components/Atoms/SubtitleText/SubtitleText.type';
// import { renderBoldText } from '@/sad-aml-shared/utils/functions/renderBoldText'

const SubtitleText = ({ text, className }: SubtitleTextProps) => {
  const [t] = useTranslation('global');

  return (
    <div className={styles.subtitleText}>
      <label
        className={
          className
            ? (styles[className] ?? className)
            : styles.subtitleText__label
        }
      >
        {text ? text : t('subtitle.loginPage')}
      </label>
    </div>
  );
};

export default SubtitleText;
