import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationWizard from './DeclarationWizard';
import type { StepDefinitions, StepProps } from './stepDefinitions';
import type { StepErrors } from '@/types/Declaration.types';
import {
  acknowledgeIntro,
  clearDraft,
  getDraft,
  saveStepValues,
} from '@/services/DeclarationService';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

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

const setup = (stepId: number) =>
  render(<DeclarationWizard stepId={stepId} definitions={definitions} />);

beforeEach(() => {
  push.mockClear();
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

  it('disables "Regresar" on the first step and "Continuar" on the last', () => {
    const { unmount } = setup(1);
    expect(screen.getByRole('button', { name: 'Regresar' })).toBeDisabled();
    unmount();
    setup(12);
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();
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

  it('shows the intro dialog until it is acknowledged, once per session', async () => {
    clearDraft();
    setup(1);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(getDraft().introAcknowledged).toBe(true);
  });
});
