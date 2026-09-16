'use client';

import {
  type FocusEvent,
  type InputHTMLAttributes,
  forwardRef,
  useId,
  useRef,
  useState,
} from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import 'remixicon/fonts/remixicon.css';
import styles from './InputSecret.module.scss';

interface InputSecretProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  placeholder?: string;
  errors?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const InputSecret = forwardRef<HTMLInputElement, InputSecretProps>(
  ({ label, placeholder, errors, id, onFocus, onBlur, ...rest }, ref) => {
    // useRef propio para el click en el wrapper (mostrar el cursor de texto
    // al hacer click fuera del input); antes se creaba pero nunca se
    // conectaba al input real, asi que ese click no hacia nada. Se combina
    // con el ref reenviado por el padre en vez de reemplazarlo.
    const inputRef = useRef<HTMLInputElement | null>(null);
    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = errors ? `${inputId}-error` : undefined;

    const [isFocus, setIsFocus] = useState(false);
    const [hide, setHide] = useState(true);
    const toggleLabel = hide ? 'Mostrar contraseña' : 'Ocultar contraseña';

    // onFocus/onBlur propios encadenados con los que pase el padre (ej.
    // React Hook Form): antes iban al final via ...rest, lo que los
    // reemplazaba por completo y rompia el estilo de foco si el padre
    // pasaba los suyos.
    const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocus(true);
      onFocus?.(event);
    };
    const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
      setIsFocus(false);
      onBlur?.(event);
    };

    return (
      <div className={styles.container}>
        <label htmlFor={inputId} className={styles.container__label}>
          {label}
        </label>
        <div
          className={`${styles.container__input_wrapper} ${
            isFocus ? styles.container__input_wrapper_focus : ''
          }`}
          onClick={() => inputRef.current?.focus()}
        >
          <input
            ref={setRefs}
            id={inputId}
            onFocus={handleFocus}
            onBlur={handleBlur}
            type={hide ? 'password' : 'text'}
            className={styles.container__input}
            placeholder={placeholder}
            autoComplete="off"
            aria-invalid={errors ? true : undefined}
            aria-describedby={errorId}
            {...rest}
          />
          <button
            aria-label={toggleLabel}
            title={toggleLabel}
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
          <p id={errorId} className={styles.container__errors} role="alert">
            {errors as string}
          </p>
        )}
      </div>
    );
  }
);

InputSecret.displayName = 'InputSecret';

export default InputSecret;
