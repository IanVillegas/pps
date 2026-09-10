import React from 'react';
import styles from './ProgressBar.module.scss';
import { Constants } from '@/sad-aml-shared/utils/Enums';
import type { ProgressBarProps } from '@/sad-aml-shared/components/Atoms/ProgressBar/ProgressBar.type';

const ProgressBar = ({
  percentage,
  width = Constants.MAX_PERCENTAGE_STRING,
}: ProgressBarProps) => {
  const getColorClass = () => {
    if (percentage <= Constants.PERCENT_GOAL_DANGER) return styles.danger;
    if (percentage <= Constants.PERCENT_GOAL_WARNING) return styles.warning;
    return styles.primary;
  };

  const getLabelClass = () => {
    if (percentage <= Constants.PERCENT_GOAL_DANGER)
      return styles.label__danger;
    if (percentage <= Constants.PERCENT_GOAL_WARNING)
      return styles.label__warning;
    return styles.label__primary;
  };

  return (
    <div className={styles.track} style={{ width }}>
      <div
        className={`${styles.fill} ${getColorClass()}`}
        style={{ width: `${percentage}%` }}
      >
        <span className={`${styles.label} ${getLabelClass()}`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
