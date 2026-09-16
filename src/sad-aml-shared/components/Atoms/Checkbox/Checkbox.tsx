'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  errors?: string;
  id?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, errors, id, disabled, className, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = errors ? `${inputId}-error` : undefined;

    return (
      <div className={`${styles.checkbox} ${className ?? ''}`}>
        <div className={styles.checkbox__row}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={styles.checkbox__input}
            disabled={disabled}
            aria-invalid={errors ? true : undefined}
            aria-describedby={errorId}
            {...rest}
          />
          <label htmlFor={inputId} className={styles.checkbox__label}>
            {label}
          </label>
        </div>
        {errors && (
          <div id={errorId} className={styles.checkbox__errors} role="alert">
            {errors}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
