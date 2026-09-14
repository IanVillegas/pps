import { render, screen } from '@testing-library/react';
import TextField from './TextField';

describe('TextField', () => {
  it('associates the label with the input via htmlFor/id (gap de sad-aml-shared)', () => {
    render(<TextField label="Cedula" />);
    expect(screen.getByLabelText('Cedula')).toBeInTheDocument();
  });

  it('links the error to the input via aria-describedby (gap de sad-aml-shared)', () => {
    render(<TextField label="Cedula" error="Cedula invalida" />);
    const input = screen.getByLabelText('Cedula');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorNode = document.getElementById(describedBy!.split(' ')[0]);
    expect(errorNode).toHaveTextContent('Cedula invalida');
  });

  it('shows a required indicator and keeps the native attribute', () => {
    render(<TextField label="Nombre" required />);
    expect(screen.getByLabelText(/Nombre/)).toBeRequired();
  });

  it('respects disabled natively', () => {
    render(<TextField label="Telefono" disabled />);
    expect(screen.getByLabelText('Telefono')).toBeDisabled();
  });
});
