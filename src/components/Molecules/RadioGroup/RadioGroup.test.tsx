import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioGroup from './RadioGroup';

const OPTIONS = [
  { value: 'estable', label: 'Estable' },
  { value: 'dificil', label: 'Difícil' },
  { value: 'grave', label: 'Grave' },
];

describe('RadioGroup', () => {
  it('names the group with its question and lists every option', () => {
    render(
      <RadioGroup
        legend="¿Cómo califica su situación financiera?"
        options={OPTIONS}
        onChange={jest.fn()}
      />
    );
    expect(
      screen.getByRole('radiogroup', {
        name: '¿Cómo califica su situación financiera?',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('marks only the controlled value as checked', () => {
    render(
      <RadioGroup
        legend="Situación"
        options={OPTIONS}
        value="dificil"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByRole('radio', { name: 'Difícil' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Estable' })).not.toBeChecked();
  });

  it('reports the chosen value on click and with the keyboard', async () => {
    const onChange = jest.fn();
    render(
      <RadioGroup legend="Situación" options={OPTIONS} onChange={onChange} />
    );
    await userEvent.click(screen.getByRole('radio', { name: 'Grave' }));
    expect(onChange).toHaveBeenLastCalledWith('grave');

    screen.getByRole('radio', { name: 'Estable' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenLastCalledWith('dificil');
  });

  it('shows the error and flags the group as invalid and focusable', () => {
    render(
      <RadioGroup
        legend="Situación"
        options={OPTIONS}
        errors="Seleccione una opción"
        onChange={jest.fn()}
      />
    );
    const group = screen.getByRole('radiogroup', { name: 'Situación' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Seleccione una opción'
    );
    expect(group).toHaveAccessibleDescription('Seleccione una opción');
  });
});
