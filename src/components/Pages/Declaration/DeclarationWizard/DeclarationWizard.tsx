'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonColor } from '@/components/Atoms';
import DeclarationStepper from '@/components/Molecules/DeclarationStepper/DeclarationStepper';
import DeclarationIntroDialog from '@/components/Organisms/DeclarationIntroDialog/DeclarationIntroDialog';
import { useDeclaration } from '@/utils/hooks/useDeclaration';
import { DECLARATION_STEPS } from '@/utils/declarationSteps';
import type { StepErrors, StepValues } from '@/types/Declaration.types';
import { STEP_DEFINITIONS, type StepDefinitions } from './stepDefinitions';
import styles from './DeclarationWizard.module.scss';

const stepPath = (stepId: number) => `/mi-declaracion/${stepId}`;
const LAST_STEP = DECLARATION_STEPS.length;
const EMPTY_VALUES: StepValues = {};

interface StepFormProps {
  stepId: number;
  definitions: StepDefinitions;
}

// Se monta con key={stepId}: al cambiar de paso el estado de errores parte
// limpio sin necesitar un efecto que lo reinicie.
const StepForm = ({ stepId, definitions }: StepFormProps) => {
  const router = useRouter();
  const { draft, saveStepValues } = useDeclaration();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<StepErrors>({});
  const [failedAttempts, setFailedAttempts] = useState(0);

  const definition = definitions[stepId];
  const Content = definition?.component;
  const values = draft.steps[stepId] ?? EMPTY_VALUES;
  const validate = (next: StepValues) => definition?.validate?.(next) ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  // Tras un intento fallido, lleva el foco al primer campo invalido.
  useEffect(() => {
    if (failedAttempts === 0) return;
    formRef.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"]')
      ?.focus();
  }, [failedAttempts]);

  const handleChange = (next: StepValues) => {
    saveStepValues(stepId, next);
    // Ya hubo un intento fallido: los errores se actualizan mientras corrige.
    if (hasErrors) setErrors(validate(next));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setFailedAttempts(count => count + 1);
      return;
    }
    router.push(stepPath(stepId + 1));
  };

  return (
    <form
      ref={formRef}
      noValidate
      className={styles.wizard__card}
      onSubmit={handleSubmit}
    >
      {hasErrors && (
        <p role="alert" className={styles.wizard__summary}>
          Revise los campos marcados para poder continuar.
        </p>
      )}
      <div className={styles.wizard__content}>
        {Content ? (
          <Content values={values} errors={errors} onChange={handleChange} />
        ) : (
          <p className={styles.wizard__placeholder}>
            El contenido de este paso aún no está disponible.
          </p>
        )}
      </div>
      <div className={styles.wizard__actions}>
        <Button
          type="button"
          text="Regresar"
          color={ButtonColor.Secondary}
          size="large"
          disabled={stepId === 1}
          onClick={() => router.push(stepPath(stepId - 1))}
        />
        <Button
          type="submit"
          text="Continuar"
          color={ButtonColor.Cta}
          size="large"
          disabled={stepId === LAST_STEP}
        />
      </div>
    </form>
  );
};

interface DeclarationWizardProps {
  stepId: number;
  /** Definiciones por paso; por defecto las reales de la declaracion. */
  definitions?: StepDefinitions;
}

/**
 * Wizard de la declaracion (DEC-006B): stepper, contenido del paso y
 * navegacion. Los pasos son no lineales: se puede saltar a cualquiera desde
 * el stepper sin validar; solo "Continuar" valida el paso actual. Los datos
 * de cada paso viven en el borrador (DeclarationService) y por eso se
 * conservan al ir y volver.
 */
const DeclarationWizard = ({
  stepId,
  definitions = STEP_DEFINITIONS,
}: DeclarationWizardProps) => {
  const router = useRouter();
  const { draft, acknowledgeIntro } = useDeclaration();

  if (!DECLARATION_STEPS.some(step => step.id === stepId)) return null;

  return (
    <div className={styles.wizard}>
      <DeclarationStepper
        steps={DECLARATION_STEPS}
        currentStep={stepId}
        onStepSelect={id => router.push(stepPath(id))}
      />
      <StepForm key={stepId} stepId={stepId} definitions={definitions} />
      <DeclarationIntroDialog
        open={!draft.introAcknowledged}
        onClose={acknowledgeIntro}
      />
    </div>
  );
};

export default DeclarationWizard;
