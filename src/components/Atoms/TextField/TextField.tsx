'use client';

import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import styles from './TextField.module.scss';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  caption?: string;
  id?: string;
}

/**
 * Campo de texto propio (DEC-002B, ver tasks/todo.md). No envuelve
 * sad-aml-shared/InputText: su label no tiene htmlFor y su error no tiene
 * asociacion ARIA, y ninguna de las dos cosas es ajustable pasando props
 * desde afuera (hay que cambiar el JSX interno del componente). Reusa los
 * mismos tokens de color/tipografia de GM para que se vea igual.
 */
const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { label, error, caption, id, required, disabled, className, ...rest },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const captionId = caption ? `${inputId}-caption` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy =
      [captionId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={[styles.field, className].filter(Boolean).join(' ')}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">
              {' '}
              *
            </span>
          ) : null}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error ? styles.inputError : '']
            .filter(Boolean)
            .join(' ')}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {caption ? (
          <div id={captionId} className={styles.caption}>
            {caption}
          </div>
        ) : null}
        {error ? (
          <div id={errorId} className={styles.error} role="alert">
            {error}
          </div>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
