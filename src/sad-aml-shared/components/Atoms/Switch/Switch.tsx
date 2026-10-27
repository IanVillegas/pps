'use client';

import styles from './Switch.module.scss';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  /** Id del elemento que contiene la pregunta; es el nombre accesible. */
  'aria-labelledby'?: string;
  'aria-label'?: string;
  /** Texto a la izquierda del interruptor (estado apagado). */
  offLabel?: string;
  /** Texto a la derecha del interruptor (estado encendido). */
  onLabel?: string;
}

/**
 * Interruptor Si/No (DEC-017; Figma, nodos 43121:1816 y 43121:2128,
 * componente "Switch"). PROVISIONAL: sad-aml-shared no tiene un interruptor;
 * cuando lo exponga, este atomo se reemplaza sin tocar a quien lo usa. Usa
 * `<button role="switch">`, asi que se activa con Espacio y Enter y los
 * lectores de pantalla anuncian su estado; los textos «No» y «Sí» son solo
 * visuales porque el estado ya lo da `aria-checked`.
 */
const Switch = ({
  checked,
  onChange,
  id,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
  offLabel = 'No',
  onLabel = 'Sí',
}: SwitchProps) => (
  <span className={styles.switch}>
    <span className={styles.switch__text} aria-hidden="true">
      {offLabel}
    </span>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={`${styles.switch__track} ${checked ? styles['switch__track--on'] : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.switch__knob} aria-hidden="true" />
    </button>
    <span className={styles.switch__text} aria-hidden="true">
      {onLabel}
    </span>
  </span>
);

export default Switch;
