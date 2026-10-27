'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, ButtonColor } from '@/components/Atoms';
import DeclarationStepper from '@/components/Molecules/DeclarationStepper/DeclarationStepper';
import RetryNotice from '@/sad-aml-shared/components/Molecules/RetryNotice/RetryNotice';
import DeclarationIntroDialog from '@/components/Organisms/DeclarationIntroDialog/DeclarationIntroDialog';
import { requestPersonalData } from '@/services/DeclarationService';
import { useCatalogs } from '@/utils/hooks/useCatalog';
import { useDeclaration } from '@/utils/hooks/useDeclaration';
import { useFinalization } from '@/utils/hooks/useFinalization';
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
  const cards = definition?.cards ?? false;
  // Con `ownActions` el paso recibe los botones y decide si los muestra.
  const stepRendersActions = cards || (definition?.ownActions ?? false);
  const values = draft.steps[stepId] ?? EMPTY_VALUES;
  const validate = (next: StepValues) => definition?.validate?.(next) ?? {};
  const hasErrors = Object.keys(errors).length > 0;

  // Alguien intento salir del paso 1 sin completarlo (stepper o direccion
  // escrita a mano): se muestran los campos que faltan.
  const personalDataRequests = draft.personalDataRequests;
  useEffect(() => {
    if (stepId !== 1 || personalDataRequests === 0) return;
    setErrors(definitions[1]?.validate?.(draft.steps[1] ?? EMPTY_VALUES) ?? {});
    setFailedAttempts(count => count + 1);
    // Solo reacciona a cada nueva peticion, no a cada tecla escrita.
  }, [personalDataRequests]);

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
    // El ultimo paso no tiene siguiente: su accion la define el propio paso.
    if (stepId === LAST_STEP) {
      definition?.onFinish?.();
      return;
    }
    router.push(stepPath(stepId + 1));
  };

  const actions = (
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
        // Figma rotula la accion del ultimo paso «Terminar».
        text={stepId === LAST_STEP ? 'Terminar' : 'Continuar'}
        color={ButtonColor.Cta}
        size="large"
        disabled={stepId === LAST_STEP && !definition?.onFinish}
      />
    </div>
  );

  return (
    <form
      ref={formRef}
      noValidate
      className={cards ? styles.wizard__cards : styles.wizard__card}
      onSubmit={handleSubmit}
    >
      {hasErrors && (
        <p role="alert" className={styles.wizard__summary}>
          Revise los campos marcados para poder continuar.
        </p>
      )}
      <div className={styles.wizard__content}>
        {Content ? (
          <Content
            values={values}
            errors={errors}
            onChange={handleChange}
            actions={stepRendersActions ? actions : undefined}
          />
        ) : (
          <p className={styles.wizard__placeholder}>
            El contenido de este paso aún no está disponible.
          </p>
        )}
      </div>
      {!stepRendersActions && actions}
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
 * navegacion. Los pasos son no lineales: una vez completados los datos
 * personales (paso 1, el unico que bloquea el avance) se puede saltar a
 * cualquiera desde el stepper sin validar; solo "Continuar" valida el paso
 * actual. Los datos
 * de cada paso viven en el borrador (DeclarationService) y por eso se
 * conservan al ir y volver.
 */
const DeclarationWizard = ({
  stepId,
  definitions = STEP_DEFINITIONS,
}: DeclarationWizardProps) => {
  const router = useRouter();
  const { draft, acknowledgeIntro } = useDeclaration();
  const { status: catalogStatus, retry: retryCatalogs } = useCatalogs();
  const { status: finalizationStatus } = useFinalization();

  // La declaracion vive solo en memoria (D-08): recargar o cerrar la pestana
  // la pierde. Si ya hay datos escritos y no se ha guardado, el navegador
  // pregunta antes de salir.
  const hasUnsavedData =
    finalizationStatus !== 'done' &&
    Object.values(draft.steps).some(step => Object.keys(step).length > 0);
  useEffect(() => {
    if (!hasUnsavedData) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedData]);

  // El paso 1 (datos personales) es el unico que bloquea el avance: mientras
  // le falte algun dato obligatorio no se puede ir a otro paso. Desde ahi el
  // desplazamiento es libre.
  const personalDataIncomplete =
    Object.keys(
      definitions[1]?.validate?.(draft.steps[1] ?? EMPTY_VALUES) ?? {}
    ).length > 0;
  const blocked =
    stepId !== 1 &&
    personalDataIncomplete &&
    DECLARATION_STEPS.some(step => step.id === stepId);

  useEffect(() => {
    if (!blocked) return;
    requestPersonalData();
    router.replace(stepPath(1));
    // `router` es estable; solo importa cuando cambia el bloqueo o el paso.
  }, [blocked, stepId]);

  if (!DECLARATION_STEPS.some(step => step.id === stepId)) return null;
  if (blocked) return null;

  const handleStepSelect = (id: number) => {
    if (id !== 1 && personalDataIncomplete) {
      requestPersonalData();
      return;
    }
    router.push(stepPath(id));
  };

  return (
    <div className={styles.wizard}>
      <DeclarationStepper
        steps={DECLARATION_STEPS}
        currentStep={stepId}
        onStepSelect={handleStepSelect}
      />
      {catalogStatus === 'error' && (
        <RetryNotice
          message="No se pudieron cargar las listas de opciones. Revise su conexión e inténtelo de nuevo."
          onRetry={retryCatalogs}
        />
      )}
      <StepForm key={stepId} stepId={stepId} definitions={definitions} />
      <DeclarationIntroDialog
        open={!draft.introAcknowledged}
        onClose={acknowledgeIntro}
      />
    </div>
  );
};

export default DeclarationWizard;
