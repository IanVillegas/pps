// DEC-006B Registro del contenido y las validaciones de cada paso.
import type { ComponentType, ReactNode } from 'react';
import type { StepErrors, StepValues } from '@/types/Declaration.types';
import PersonalData, {
  validatePersonalData,
} from '@/components/Pages/Declaration/PersonalData/PersonalData';
import Family from '@/components/Pages/Declaration/Family/Family';
import IncomeExpenses, {
  validateIncomeExpenses,
} from '@/components/Pages/Declaration/IncomeExpenses/IncomeExpenses';
import RealEstate from '@/components/Pages/Declaration/RealEstate/RealEstate';
import MovableAssets from '@/components/Pages/Declaration/MovableAssets/MovableAssets';
import Savings from '@/components/Pages/Declaration/Savings/Savings';
import CurrentAccounts from '@/components/Pages/Declaration/CurrentAccounts/CurrentAccounts';
import Credits from '@/components/Pages/Declaration/Credits/Credits';
import CreditCards from '@/components/Pages/Declaration/CreditCards/CreditCards';
import LegalEntities from '@/components/Pages/Declaration/LegalEntities/LegalEntities';
import JudicialData, {
  validateJudicialData,
} from '@/components/Pages/Declaration/JudicialData/JudicialData';
import Completion from '@/components/Pages/Declaration/Completion/Completion';
import { openOath } from '@/services/FinalizationService';

/** Lo que el wizard le entrega al contenido de cada paso */
export interface StepProps {
  values: StepValues;
  /** Errores por nombre de campo llegan con un intento fallido de continuar */
  errors: StepErrors;
  /** Reemplaza los valores del paso, el wizard los guarda en el borrador */
  onChange: (values: StepValues) => void;
  actions?: ReactNode;
}

export interface StepDefinition {
  /** Contenido del paso; sin definir se muestra un marcador */
  component?: ComponentType<StepProps>;
  /** Devuelve los errores por campo */
  validate?: (values: StepValues) => StepErrors;
  cards?: boolean;
  ownActions?: boolean;
  onFinish?: () => void;
}

export type StepDefinitions = Partial<Record<number, StepDefinition>>;

// Mientras no exista, el paso se puede visitar
export const STEP_DEFINITIONS: StepDefinitions = {
  1: { component: PersonalData, validate: validatePersonalData },
  2: { component: Family },
  // Las tablas pueden quedar vacias solo las dos preguntas de "Otros
  // detalles" son obligatorias
  3: {
    component: IncomeExpenses,
    validate: validateIncomeExpenses,
    cards: true,
  },
  4: { component: RealEstate },
  5: { component: MovableAssets },
  6: { component: Savings },
  7: { component: CurrentAccounts },
  8: { component: Credits },
  9: { component: CreditCards },
  10: { component: LegalEntities },
  // Solo la pension alimenticia exige campos, y unicamente cuando esta en «Sí»
  11: { component: JudicialData, validate: validateJudicialData },
  12: { component: Completion, ownActions: true, onFinish: openOath },
};
