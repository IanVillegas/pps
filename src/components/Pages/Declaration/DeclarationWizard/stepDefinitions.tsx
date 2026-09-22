import type { ComponentType } from 'react';
import type { StepErrors, StepValues } from '@/types/Declaration.types';

/** Lo que el wizard le entrega al contenido de cada paso. */
export interface StepProps {
  values: StepValues;
  /** Errores por nombre de campo; llegan tras un intento fallido de continuar. */
  errors: StepErrors;
  /** Reemplaza los valores del paso; el wizard los guarda en el borrador. */
  onChange: (values: StepValues) => void;
}

export interface StepDefinition {
  /** Contenido del paso; sin definir se muestra un marcador. */
  component?: ComponentType<StepProps>;
  /** Devuelve los errores por campo; un objeto vacio significa paso valido. */
  validate?: (values: StepValues) => StepErrors;
}

export type StepDefinitions = Partial<Record<number, StepDefinition>>;

// Cada tarea de paso (DEC-007 en adelante) agrega aqui su entrada. Mientras
// no exista, el paso se puede visitar y "Continuar" avanza sin validar.
export const STEP_DEFINITIONS: StepDefinitions = {};
