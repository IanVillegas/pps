import React from 'react';
import styles from './Spinner.module.scss';
import type { SpinnerProps } from '@/sad-aml-shared/components/Atoms/Spinner/Spinner.type';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import { SizeEnum } from '@/sad-aml-shared/types/enum/Size.enum';

/**
 * Spinner component that displays a loading animation
 * @component
 * @param {SpinnerProps} props - Component props
 * @param {SizeEnum} [props.size=SizeEnum.Small] - Size of the spinner (Small, Medium, Large)
 * @param {ColorEnum} [props.color=ColorEnum.Dark] - Color of the spinner (Dark, Light)
 * @returns {JSX.Element} Spinner component
 */
export default function Spinner({
  size = SizeEnum.Small,
  color = ColorEnum.Dark,
}: SpinnerProps) {
  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`${styles.spinner__circle}
                        ${styles[`spinner__circle${i + 1}`]}
                        ${styles[`spinner__circle__${color}`]}
                        `}
        ></div>
      ))}
    </div>
  );
}
