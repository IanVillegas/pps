import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationWizard from './DeclarationWizard';
import type { StepDefinitions, StepProps } from './stepDefinitions';
import type { StepErrors } from '@/types/Declaration.types';
import {
  acknowledgeIntro,
  clearDraft,
  getDraft,
  requestPersonalData,
  saveStepValues,
} from '@/services/DeclarationService';

const push = jest.fn();
const replace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

// Paso de prueba con un campo obligatorio; el real llega con DEC-007.
const NameStep = ({ values, errors, onChange }: StepProps) => (
  <label>
    Nombre
    <input
      value={String(values.nombre ?? '')}
      aria-invalid={errors.nombre ? true : undefined}
      onChange={event => onChange({ ...values, nombre: event.target.value })}
    />
    {errors.nombre && <span>{errors.nombre}</span>}
  </label>
);
const definitions: StepDefinitions = {
  1: {
    component: NameStep,
    validate: (values): StepErrors =>
      values.nombre ? {} : { nombre: 'El nombre es obligatorio' },
  },
};

// Los pasos posteriores al 1 solo se ven con los datos personales completos;
// por defecto la prueba los deja completos para ocuparse de lo suyo.
const setup = (stepId: number, { personalDataDone = true } = {}) => {
  if (stepId > 1 && personalDataDone) saveStepValues(1, { nombre: 'Ana' });
  return render(
    <DeclarationWizard stepId={stepId} definitions={definitions} />
  );
};

beforeEach(() => {
  push.mockClear();
  replace.mockClear();
  clearDraft();
  acknowledgeIntro();
});

describe('DeclarationWizard', () => {
  it('shows the stepper with the current step marked and a placeholder for steps without content', () => {
    setup(2);
    expect(screen.getByRole('button', { name: 'Paso 2' })).toHaveAttribute(
      'aria-current',
      'step'
    );
    expect(screen.getByText(/aún no está disponible/)).toBeInTheDocument();
  });

  it('renders nothing for a step out of range', () => {
    const { container } = setup(13);
    expect(container).toBeEmptyDOMElement();
  });

  it('disables "Regresar" on the first step and the action of the last step, which Figma calls "Terminar"', () => {
    const { unmount } = setup(1);
    expect(screen.getByRole('button', { name: 'Regresar' })).toBeDisabled();
    unmount();
    setup(12);
    expect(screen.getByRole('button', { name: 'Terminar' })).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Continuar' })
    ).not.toBeInTheDocument();
  });

  it('lets the last step define what its action does and decide where the buttons go', async () => {
    const onFinish = jest.fn();
    const LastStep = ({ actions }: StepProps) => (
      <>
        <p>Contenido propio</p>
        {actions}
      </>
    );
    render(
      <DeclarationWizard
        stepId={12}
        definitions={{
          12: { component: LastStep, ownActions: true, onFinish },
        }}
      />
    );
    const finish = screen.getByRole('button', { name: 'Terminar' });
    expect(finish).toBeEnabled();
    await userEvent.click(finish);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });

  it('does not show the buttons twice when the step renders them itself', () => {
    const LastStep = ({ actions }: StepProps) => <>{actions}</>;
    render(
      <DeclarationWizard
        stepId={12}
        definitions={{
          12: { component: LastStep, ownActions: true, onFinish: jest.fn() },
        }}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Terminar' })).toHaveLength(1);
  });

  it('blocks "Continuar" while the step is invalid, announces it and focuses the first bad field', async () => {
    setup(1);
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(push).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/Revise los campos/);
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/)).toHaveFocus();
  });

  it('clears the error as the user fixes it and then advances to the next step', async () => {
    setup(1);
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    await userEvent.type(screen.getByLabelText(/Nombre/), 'Ana');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(push).toHaveBeenCalledWith('/mi-declaracion/2');
  });

  it('advances without validating steps that define no rules', async () => {
    setup(2);
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(push).toHaveBeenCalledWith('/mi-declaracion/3');
  });

  it('jumps between steps without validating and keeps the data already typed', async () => {
    setup(1);
    await userEvent.type(screen.getByLabelText(/Nombre/), 'An');
    await userEvent.click(screen.getByRole('button', { name: 'Paso 9' }));
    expect(push).toHaveBeenLastCalledWith('/mi-declaracion/9');
    expect(getDraft().steps[1]).toEqual({ nombre: 'An' });
  });

  it('keeps entered values when the step is shown again', () => {
    saveStepValues(1, { nombre: 'Luis' });
    setup(1);
    expect(screen.getByLabelText(/Nombre/)).toHaveValue('Luis');
  });

  it('goes back one step with "Regresar"', async () => {
    setup(5);
    await userEvent.click(screen.getByRole('button', { name: 'Regresar' }));
    expect(push).toHaveBeenCalledWith('/mi-declaracion/4');
  });

  it('gives a step with its own cards the buttons to place inside, without a second set below', () => {
    const CardsStep = ({ actions }: StepProps) => (
      <section aria-label="Ultima tarjeta">{actions}</section>
    );
    render(
      <DeclarationWizard
        stepId={1}
        definitions={{ 1: { component: CardsStep, cards: true } }}
      />
    );
    const card = screen.getByRole('region', { name: 'Ultima tarjeta' });
    expect(card).toContainElement(
      screen.getByRole('button', { name: 'Continuar' })
    );
    expect(screen.getAllByRole('button', { name: 'Continuar' })).toHaveLength(
      1
    );
    expect(screen.getAllByRole('button', { name: 'Regresar' })).toHaveLength(1);
  });

  it('still places the buttons below the content for a step without its own cards', () => {
    setup(1);
    expect(screen.getAllByRole('button', { name: 'Continuar' })).toHaveLength(
      1
    );
  });

  it('shows the intro dialog until it is acknowledged, once per session', async () => {
    clearDraft();
    setup(1);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(getDraft().introAcknowledged).toBe(true);
  });

  describe('salir con datos sin guardar', () => {
    const fireBeforeUnload = () => {
      const event = new Event('beforeunload', { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    };

    it('does not warn when nothing has been typed', () => {
      setup(1);
      expect(fireBeforeUnload()).toBe(false);
    });

    it('warns before leaving the page once there is data that is only kept in memory', () => {
      saveStepValues(2, { hijos: 1 });
      setup(2);
      expect(fireBeforeUnload()).toBe(true);
    });

    it('stops warning once the wizard is closed', () => {
      saveStepValues(2, { hijos: 1 });
      const { unmount } = setup(2);
      unmount();
      expect(fireBeforeUnload()).toBe(false);
    });
  });

  describe('bloqueo del paso 1 (datos personales)', () => {
    it('does not let the stepper leave step 1 while it is incomplete and shows what is missing', async () => {
      setup(1);
      await userEvent.click(screen.getByRole('button', { name: 'Paso 5' }));
      expect(push).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(/Revise los campos/);
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      expect(screen.getByLabelText(/Nombre/)).toHaveFocus();
    });

    it('sends a direct visit to a later step back to step 1 with its errors shown', () => {
      const { container } = setup(7, { personalDataDone: false });
      expect(container).toBeEmptyDOMElement();
      expect(replace).toHaveBeenCalledWith('/mi-declaracion/1');
      expect(getDraft().personalDataRequests).toBe(1);
    });

    it('shows the errors on step 1 when it is reached after being sent back', () => {
      saveStepValues(1, {});
      // Una peticion previa de completar los datos (visita directa a otro paso).
      requestPersonalData();
      setup(1);
      expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    });

    it('lets the person move freely between the other steps once step 1 is complete', async () => {
      setup(1);
      await userEvent.type(screen.getByLabelText(/Nombre/), 'Ana');
      await userEvent.click(screen.getByRole('button', { name: 'Paso 8' }));
      expect(push).toHaveBeenLastCalledWith('/mi-declaracion/8');
      expect(replace).not.toHaveBeenCalled();
    });

    it('does not redirect when step 1 has no validation rules', () => {
      render(
        <DeclarationWizard
          stepId={4}
          definitions={{ 1: { component: NameStep } }}
        />
      );
      expect(replace).not.toHaveBeenCalled();
    });
  });
});
