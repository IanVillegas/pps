import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Switch from './Switch';

const Harness = ({ initial = false }: { initial?: boolean }) => {
  const [checked, setChecked] = useState(initial);
  return (
    <>
      <p id="question">¿Posee usted embargos?</p>
      <Switch
        checked={checked}
        onChange={setChecked}
        aria-labelledby="question"
      />
    </>
  );
};

describe('Switch', () => {
  it('is named by its question and starts off', () => {
    render(<Harness />);
    const toggle = screen.getByRole('switch', {
      name: '¿Posee usted embargos?',
    });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('toggles with a click and with the keyboard', async () => {
    render(<Harness />);
    const toggle = screen.getByRole('switch');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    toggle.focus();
    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('reports the new value to the parent', async () => {
    const onChange = jest.fn();
    render(
      <Switch checked={false} onChange={onChange} aria-label="Pregunta" />
    );
    await userEvent.click(screen.getByRole('switch', { name: 'Pregunta' }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('shows No and Sí only as visual text, not as part of the name', () => {
    render(<Switch checked onChange={jest.fn()} aria-label="Pregunta" />);
    expect(screen.getByRole('switch')).toHaveAccessibleName('Pregunta');
    expect(screen.getByText('No')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Sí')).toHaveAttribute('aria-hidden', 'true');
  });
});
