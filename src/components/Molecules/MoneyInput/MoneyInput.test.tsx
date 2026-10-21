import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoneyInput from './MoneyInput';

// Campo controlado, como lo usan los modales: guarda el texto decimal.
const Harness = ({
  initial = '',
  currency,
}: {
  initial?: string;
  currency?: string;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <>
      <MoneyInput
        label="Monto"
        currency={currency}
        value={value}
        onChange={setValue}
      />
      <output data-testid="stored">{value}</output>
    </>
  );
};

const stored = () => screen.getByTestId('stored').textContent;

describe('MoneyInput', () => {
  it('shows the example as placeholder and nothing typed yet', () => {
    render(<Harness />);
    const field = screen.getByLabelText('Monto');
    expect(field).toHaveAttribute('placeholder', '0,000.00');
    expect(field).toHaveValue('');
  });

  it('stores a decimal text with two decimals while it shows commas', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('Monto'), '123456');
    expect(screen.getByLabelText('Monto')).toHaveValue('1,234.56');
    expect(stored()).toBe('1234.56');
  });

  it('treats zero as a valid amount and shows it with decimals', async () => {
    render(<Harness />);
    await userEvent.type(screen.getByLabelText('Monto'), '0');
    expect(screen.getByLabelText('Monto')).toHaveValue('0.00');
    expect(stored()).toBe('0.00');
  });

  it('reads a whole amount from older data as whole units', () => {
    render(<Harness initial="1500000" />);
    expect(screen.getByLabelText('Monto')).toHaveValue('1,500,000.00');
  });

  it('empties the stored value when the last digit is deleted', async () => {
    render(<Harness initial="0.01" />);
    await userEvent.type(screen.getByLabelText('Monto'), '{Backspace}');
    expect(screen.getByLabelText('Monto')).toHaveValue('');
    expect(stored()).toBe('');
  });

  it('accepts a pasted number as cents', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByLabelText('Monto'));
    await userEvent.paste('250075');
    expect(screen.getByLabelText('Monto')).toHaveValue('2,500.75');
  });

  it('draws the icon of the chosen currency at the start of the field, and keeps the same input when it appears', () => {
    const { rerender } = render(
      <MoneyInput label="Monto" value="" onChange={jest.fn()} />
    );
    const field = screen.getByLabelText('Monto');
    expect(field.parentElement?.querySelector('svg')).toBeNull();

    rerender(
      <MoneyInput
        label="Monto"
        currency="dolares"
        value=""
        onChange={jest.fn()}
      />
    );
    // Misma entrada en el DOM (no se vuelve a montar al elegir la moneda).
    expect(screen.getByLabelText('Monto')).toBe(field);
    expect(field.parentElement?.querySelector('svg')).toBeInTheDocument();
  });

  it('shows the error under the field', () => {
    render(
      <MoneyInput
        label="Monto"
        value=""
        errors="El monto es requerido"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Monto')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByText('El monto es requerido')).toBeInTheDocument();
  });
});
