import { type InputHTMLAttributes, type JSX, forwardRef, useId } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import styles from './InputText.module.scss';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  caption?: string;
  pattern?: string;
  tooltip?: JSX.Element;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  ({ label, errors, caption, pattern, tooltip, id, ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const captionId = caption ? `${inputId}-caption` : undefined;
    const errorId = errors ? `${inputId}-error` : undefined;
    const describedBy =
      [captionId, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className={styles.inputText}>
        <label htmlFor={inputId} className={styles.inputText__label}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={styles.inputText__input}
          type="text"
          pattern={pattern}
          aria-invalid={errors ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {tooltip}
        <div className={styles.inputText__alerts}>
          {caption && (
            <div id={captionId} className={styles.inputText__captions}>
              {caption}
            </div>
          )}
          {errors && (
            <div id={errorId} className={styles.inputText__errors} role="alert">
              {errors as string}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputText.displayName = 'InputText';

export default InputText;
