import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationStepper from './DeclarationStepper';
import { DECLARATION_STEPS } from '@/utils/declarationSteps';

const setup = (currentStep = 2) => {
  const onStepSelect = jest.fn();
  render(
    <DeclarationStepper
      steps={DECLARATION_STEPS}
      currentStep={currentStep}
      onStepSelect={onStepSelect}
    />
  );
  return { onStepSelect };
};

describe('DeclarationStepper', () => {
  it('renders the twelve configured steps', () => {
    setup();
    expect(DECLARATION_STEPS).toHaveLength(12);
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('marks only the current step and never a completed state', () => {
    setup(3);
    const current = screen
      .getAllByRole('button')
      .filter(button => button.getAttribute('aria-current') === 'step');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName('Paso 3');
  });

  it('lets the user jump to any step, not only the next one', async () => {
    const { onStepSelect } = setup(2);
    await userEvent.click(screen.getByRole('button', { name: 'Paso 9' }));
    expect(onStepSelect).toHaveBeenCalledWith(9);
    await userEvent.click(screen.getByRole('button', { name: 'Paso 1' }));
    expect(onStepSelect).toHaveBeenLastCalledWith(1);
  });

  it('does not re-select the current step', async () => {
    const { onStepSelect } = setup(2);
    await userEvent.click(screen.getByRole('button', { name: 'Paso 2' }));
    expect(onStepSelect).not.toHaveBeenCalled();
  });

  it('shows the full section name in a tooltip on keyboard focus and hides it on Escape', async () => {
    setup(1);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Paso 1' })).toHaveFocus();
    expect(
      (await screen.findAllByText('Datos generales')).length
    ).toBeGreaterThan(0);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('Datos generales')).not.toBeInTheDocument();
  });

  it('moves focus with arrow keys, Home and End', async () => {
    setup(1);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Paso 3' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Paso 12' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('button', { name: 'Paso 1' })).toHaveFocus();
  });
});
