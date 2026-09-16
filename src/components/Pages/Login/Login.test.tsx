import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows required errors when submitting empty fields', async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Ingrese su usuario')).toBeInTheDocument();
    expect(screen.getByText('Ingrese su contraseña')).toBeInTheDocument();
  });

  it('logs in with valid credentials and shows the success state', async () => {
    render(<Login />);
    await userEvent.type(screen.getByLabelText('Usuario'), 'ivillegas');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    expect(await screen.findByText('Ingreso exitoso.')).toBeInTheDocument();
  });

  it('remembers only the username, never the password, when checked', async () => {
    render(<Login />);
    await userEvent.type(screen.getByLabelText('Usuario'), 'ivillegas');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'secreta123');
    await userEvent.click(screen.getByLabelText('Recordar mi usuario'));
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));

    await screen.findByText('Ingreso exitoso.');
    expect(window.localStorage.getItem('decpat.rememberedUsername')).toBe(
      'ivillegas'
    );
    expect(JSON.stringify(window.localStorage)).not.toContain('secreta123');
  });

  it('pre-fills the username and checks "recordar usuario" if one was remembered', () => {
    window.localStorage.setItem('decpat.rememberedUsername', 'ivillegas');
    render(<Login />);

    expect(screen.getByLabelText('Usuario')).toHaveValue('ivillegas');
    expect(screen.getByLabelText('Recordar mi usuario')).toBeChecked();
  });

  it('toggles the password visibility', async () => {
    render(<Login />);
    const password = screen.getByLabelText('Contraseña');
    expect(password).toHaveAttribute('type', 'password');

    await userEvent.click(
      screen.getByRole('button', { name: 'Mostrar contraseña' })
    );
    expect(password).toHaveAttribute('type', 'text');
  });
});
