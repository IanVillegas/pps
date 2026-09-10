'use client';

import { type InputHTMLAttributes, forwardRef, useRef, useState } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import 'remixicon/fonts/remixicon.css';
import styles from './InputSecret.module.scss';
import { useTranslation } from 'react-i18next';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  errors:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}

const InputSecret = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, placeholder, errors, ...rest }, ref) => {
    const [t] = useTranslation('global');
    const inputRef = useRef<HTMLInputElement>(null);
    const input = inputRef.current;
    const [isFocus, setIsFocus] = useState(false);
    const [hide, setHide] = useState(true);

    return (
      <div className={styles.container}>
        <label className={styles.container__label}>{label}</label>
        <div
          className={`${styles.container__input_wrapper} ${
            isFocus ? styles.container__input_wrapper_focus : ''
          }`}
          onClick={() => input?.focus()}
        >
          <input
            ref={ref}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            type={hide ? 'password' : 'text'}
            className={styles.container__input}
            placeholder={placeholder}
            autoComplete="off"
            {...rest}
          />
          <button
            title={t('button.shared.toggleHide') ?? ''}
            className={styles.container__button}
            type="button"
            onClick={() => setHide(prev => !prev)}
          >
            {hide ? (
              <i className="ri-eye-close-line"></i>
            ) : (
              <i className="ri-eye-2-line"></i>
            )}
          </button>
        </div>
        {errors && (
          <p className={styles.container__errors}>{errors as string}</p>
        )}
      </div>
    );
  }
);

InputSecret.displayName = 'InputSecret';

export default InputSecret;
