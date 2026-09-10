import { type InputHTMLAttributes, type JSX, forwardRef } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import styles from './InputText.module.scss';

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errors?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  caption?: string;
  pattern?: string;
  maxlength?: string;
  tooltip?: JSX.Element;
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>(
  (
    {
      label,
      errors,
      caption,
      maxlength: _maxlength,
      pattern,
      tooltip,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={styles.inputText}>
        <label className={styles.inputText__label}>{label}</label>
        <input
          ref={ref}
          className={styles.inputText__input}
          type="text"
          pattern={pattern}
          {...rest}
        />
        {tooltip}
        <div className={styles.inputText__alerts}>
          {caption && (
            <div className={styles.inputText__captions}>{caption}</div>
          )}
          {errors && (
            <div className={styles.inputText__errors}>{errors as string}</div>
          )}
        </div>
      </div>
    );
  }
);

InputText.displayName = 'InputText';

export default InputText;
