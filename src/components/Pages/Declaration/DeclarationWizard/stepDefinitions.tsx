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

/** Lo que el wizard le entrega al contenido de cada paso. */
export interface StepProps {
  values: StepValues;
  /** Errores por nombre de campo; llegan tras un intento fallido de continuar. */
  errors: StepErrors;
  /** Reemplaza los valores del paso; el wizard los guarda en el borrador. */
  onChange: (values: StepValues) => void;
  /**
   * Botones Regresar/Continuar. Solo llegan a los pasos con `cards: true` o
   * `ownActions: true`, que deciden donde colocarlos (o si mostrarlos); el
   * resto los recibe ya renderizados por el wizard debajo del contenido.
   */
  actions?: ReactNode;
}

export interface StepDefinition {
  /** Contenido del paso; sin definir se muestra un marcador. */
  component?: ComponentType<StepProps>;
  /** Devuelve los errores por campo; un objeto vacio significa paso valido. */
  validate?: (values: StepValues) => StepErrors;
  /**
   * El paso dibuja sus propias tarjetas (Figma separa el paso 3 en tres) y el
   * wizard no le pone la tarjeta unica alrededor.
   */
  cards?: boolean;
  /**
   * El paso decide si muestra los botones Regresar/Continuar (los recibe en
   * `actions`) y donde, pero el wizard sigue dibujando la tarjeta unica. Lo usa
   * el ultimo paso, que reemplaza los botones por los del juramento.
   */
  ownActions?: boolean;
  /**
   * Que hace «Continuar» en el ultimo paso, donde no hay un paso siguiente.
   * Sin definirlo, el boton del ultimo paso queda deshabilitado.
   */
  onFinish?: () => void;
}

export type StepDefinitions = Partial<Record<number, StepDefinition>>;

// Cada tarea de paso (DEC-007 en adelante) agrega aqui su entrada. Mientras
// no exista, el paso se puede visitar y "Continuar" avanza sin validar.
export const STEP_DEFINITIONS: StepDefinitions = {
  1: { component: PersonalData, validate: validatePersonalData },
  // Sin `validate`: la tabla puede quedar vacia y aun asi terminar (D-16).
  2: { component: Family },
  // Las tablas pueden quedar vacias (D-16); solo las dos preguntas de «Otros
  // detalles» son obligatorias.
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
  // Solo la pension alimenticia exige campos, y unicamente cuando esta en «Sí».
  11: { component: JudicialData, validate: validateJudicialData },
  // Cuestionario confidencial y juramento. El cuestionario guarda sus
  // respuestas aparte del borrador (ConfidentialReportService, D-12) y el
  // estado del cierre vive en FinalizationService; por eso el paso no usa los
  // valores del wizard. «Terminar» abre el juramento y el paso reemplaza los
  // botones del wizard por «Guardar».
  12: { component: Completion, ownActions: true, onFinish: openOath },
};
