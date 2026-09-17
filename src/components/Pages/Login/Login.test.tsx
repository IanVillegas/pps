import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';

describe('Login', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows required errors after leaving empty fields', async () => {
    render(<Login />);
    await userEvent.click(screen.getByLabelText('Usuario'));
    await userEvent.tab();
    await userEvent.tab();

    expect(
      await screen.findByText('El usuario es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('La contraseña es requerida')).toBeInTheDocument();
  });

  it('enables submit only while both fields contain text', async () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: 'Ingresar' });
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Usuario'), 'ab');
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Contraseña'), 'x');
    expect(button).toBeEnabled();
    await userEvent.clear(screen.getByLabelText('Usuario'));
    expect(button).toBeDisabled();
    expect(screen.queryByText('Centro de ayuda')).not.toBeInTheDocument();
  });

  it('rejects short usernames and clears the error at five characters', async () => {
    render(<Login />);
    await userEvent.type(screen.getByLabelText('Usuario'), 'abcd');
    await userEvent.type(screen.getByLabelText('Contraseña'), 'x');
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
    expect(
      await screen.findByText('El campo debe tener al menos 5 caracteres')
    ).toBeInTheDocument();
    expect(screen.queryByText('Ingreso exitoso.')).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Usuario'), 'e');
    expect(
      screen.queryByText('El campo debe tener al menos 5 caracteres')
    ).not.toBeInTheDocument();
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
