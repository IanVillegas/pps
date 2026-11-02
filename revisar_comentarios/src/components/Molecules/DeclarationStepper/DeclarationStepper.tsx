'use client';

import { Fragment, useRef, type KeyboardEvent } from 'react';
import { Tooltip } from '@/components/Atoms';
import type { DeclarationStep } from '@/types/DeclarationStep.types';
import styles from './DeclarationStepper.module.scss';

interface DeclarationStepperProps {
  steps: readonly DeclarationStep[];
  currentStep: number;
  onStepSelect: (stepId: number) => void;
}

// La declaracion es libre, por eso no hay pasos "completos" ni "pendientes", solo el paso actual
const DeclarationStepper = ({
  steps,
  currentStep,
  onStepSelect,
}: DeclarationStepperProps) => {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const last = steps.length - 1;
    const target =
      event.key === 'ArrowRight'
        ? Math.min(index + 1, last)
        : event.key === 'ArrowLeft'
          ? Math.max(index - 1, 0)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null;
    if (target === null) return;
    event.preventDefault();
    buttons.current[target]?.focus();
  };

  return (
    <nav aria-label="Pasos de la declaración">
      <ol className={styles.stepper}>
        {steps.map((step, index) => {
          const isCurrent = step.id === currentStep;
          return (
            <Fragment key={step.id}>
              {index > 0 && (
                <li aria-hidden="true" className={styles.stepper__connector} />
              )}
              <li className={styles.stepper__item}>
                <Tooltip content={step.title}>
                  <button
                    ref={node => {
                      buttons.current[index] = node;
                    }}
                    type="button"
                    className={styles.stepper__button}
                    aria-label={`Paso ${step.id}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    onClick={() => {
                      if (!isCurrent) onStepSelect(step.id);
                    }}
                    onKeyDown={event => handleKeyDown(event, index)}
                  >
                    <span
                      className={`${styles.stepper__marker} ${
                        isCurrent ? styles['stepper__marker--current'] : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span className={styles.stepper__number} aria-hidden="true">
                      {step.id}
                    </span>
                  </button>
                </Tooltip>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default DeclarationStepper;
