'use client';

import type { ButtonHTMLAttributes, JSX } from 'react';
import styles from './Button.module.scss';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';

type Size =
  | 'x-small'
  | 'longer'
  | 'large'
  | 'medium'
  | 'small'
  | 'mediumCard'
  | 'doubleOption'
  | 'largeCard'
  | 'mediumL'
  | 'auto';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string | null;
  lefIcon?: JSX.Element;
  children?: JSX.Element | string;
  size?: Size;
  color?: ColorEnum;
  ghost?: boolean;
  border?: boolean;
  block?: boolean;
  icon?: JSX.Element;
  spinner?: boolean;
  link?: boolean;
  isGap?: boolean;
  variant?: 'outlined';
  isWhiteBackground?: boolean;
  customClass?: string;
}

const Button = ({
  text,
  lefIcon,
  size = 'medium',
  color = ColorEnum.Green,
  ghost = false,
  border = true,
  block = false,
  icon,
  spinner = false,
  link,
  isGap = false,
  variant,
  disabled = false,
  children,
  isWhiteBackground = false,
  customClass = '',
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`
                ${styles.button} 
                ${styles[size]} 
                ${styles[color]} 
                ${border && styles.border} 
                ${ghost && styles.ghost} 
                ${block && styles.block}
                ${link && styles.link}
                ${isGap && styles.isGap} 
                ${variant && styles[variant]}
                ${disabled && (link ? styles.disabledLink : styles.disabled)}
                ${isWhiteBackground && styles.isWhiteBackground}
                ${styles[customClass]}
            `}
      onMouseDown={e => {
        e.preventDefault();
      }}
      {...rest}
      disabled={disabled}
    >
      {children ?? children}
      {lefIcon ? (
        <span className={styles.button__leftIcon}>{lefIcon}</span>
      ) : null}
      {text ?? text}
      {icon || spinner ? (
        spinner ? (
          <span className={`${styles.spinner} `}>
            {icon ?? <i className="ri-loader-4-line"></i>}
          </span>
        ) : (
          <span>{icon}</span>
        )
      ) : null}
    </button>
  );
};

export default Button;
