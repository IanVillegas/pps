'use client';

import { useId } from 'react';
import styles from './RadioGroup.module.scss';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  /** Pregunta; es el nombre accesible del grupo */
  legend: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  errors?: string;
}

/**
 * Grupo de botones de radio (DEC-009D). PROVISIONAL: sad-aml-shared solo
 * tiene CardRadioButton (tarjeta con icono), no un radio simple
 */
const RadioGroup = ({
  legend,
  options,
  value,
  onChange,
  errors,
}: RadioGroupProps) => {
  const name = useId();
  const errorId = errors ? `${name}-error` : undefined;

  return (
    // aria-invalid no aplica al rol radio sino al grupo; con tabIndex -1 el
    // wizard puede llevar el foco aquí después un intento fallido de continuar
    <fieldset
      role="radiogroup"
      className={styles.radioGroup}
      aria-invalid={errors ? true : undefined}
      aria-describedby={errorId}
      tabIndex={errors ? -1 : undefined}
    >
      <legend className={styles.radioGroup__legend}>{legend}</legend>
      <div className={styles.radioGroup__options}>
        {options.map(option => (
          <label key={option.value} className={styles.radioGroup__option}>
            <input
              type="radio"
              className={styles.radioGroup__input}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className={styles.radioGroup__label}>{option.label}</span>
          </label>
        ))}
      </div>
      {errors && (
        <div id={errorId} className={styles.radioGroup__errors} role="alert">
          {errors}
        </div>
      )}
    </fieldset>
  );
};

export default RadioGroup;
