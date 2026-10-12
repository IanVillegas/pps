'use client';

import { useId } from 'react';
import styles from './RadioGroup.module.scss';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  /** Pregunta; es el nombre accesible del grupo. */
  legend: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  errors?: string;
  /** 'inline': la pregunta a la izquierda y las opciones a su derecha. */
  layout?: 'stacked' | 'inline';
  /** Etiquetas mas chicas (Poppins Light 13px), como el Si/No de Figma. */
  compact?: boolean;
}

/**
 * Grupo de botones de radio (DEC-009D; Figma, nodos 43121:5711 y
 * 43121:5718, componente "Radio-NEW"). PROVISIONAL: sad-aml-shared solo
 * tiene CardRadioButton (tarjeta con icono), no un radio simple; cuando
 * shared lo exponga, este componente se reemplaza sin tocar a quien lo usa.
 * Usa `<input type="radio">` nativo para conservar teclado (flechas) y
 * lectores de pantalla.
 */
const RadioGroup = ({
  legend,
  options,
  value,
  onChange,
  errors,
  layout = 'stacked',
  compact = false,
}: RadioGroupProps) => {
  const name = useId();
  const errorId = errors ? `${name}-error` : undefined;

  return (
    // aria-invalid no aplica al rol radio sino al grupo; con tabIndex -1 el
    // wizard puede llevar el foco aqui tras un intento fallido de continuar.
    <fieldset
      role="radiogroup"
      className={`${styles.radioGroup} ${layout === 'inline' ? styles['radioGroup--inline'] : ''}`}
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
            <span
              className={`${styles.radioGroup__label} ${compact ? styles['radioGroup__label--compact'] : ''}`}
            >
              {option.label}
            </span>
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
