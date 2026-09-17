import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { login } from '@/services/AuthService';

jest.mock('@/services/AuthService', () => ({
  ...jest.requireActual('@/services/AuthService'),
  login: jest.fn(),
}));
const mockLogin = jest.mocked(login);

const fillForm = () => {
  fireEvent.change(screen.getByLabelText('Usuario'), {
    target: { value: 'prueba' },
  });
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'secreto' },
  });
};

beforeEach(() => {
  mockLogin.mockReset();
  window.localStorage.clear();
});
afterEach(() => {
  jest.useRealTimers();
});

it('preserves the username after invalid credentials and allows retry', async () => {
  mockLogin.mockResolvedValueOnce({
    success: false,
    reason: 'invalid_credentials',
  });
  mockLogin.mockResolvedValueOnce({ success: true });
  render(<Login />);
  fillForm();
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
  expect(await screen.findByRole('alertdialog')).toHaveTextContent(
    'El usuario o contraseña es incorrecto'
  );
  await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
  expect(screen.getByLabelText('Usuario')).toHaveValue('prueba');
  expect(screen.getByLabelText('Contraseña')).toHaveValue('');
  expect(screen.getByLabelText('Contraseña')).toHaveFocus();
  fireEvent.change(screen.getByLabelText('Contraseña'), {
    target: { value: 'nuevo' },
  });
  await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }));
  expect(await screen.findByText('Ingreso exitoso.')).toBeInTheDocument();
});

it('keeps the lock after closing and expires using the absolute deadline', async () => {
  jest.useFakeTimers();
  mockLogin.mockResolvedValue({
    success: false,
    reason: 'locked',
    retryAt: Date.now() + 300000,
  });
  render(<Login />);
  fillForm();
  await act(async () => {
    fireEvent.submit(
      screen.getByRole('button', { name: 'Ingresar' }).closest('form')!
    );
  });
  expect(screen.getByRole('timer')).toHaveTextContent('05:00');
  fireEvent.click(screen.getByRole('button', { name: 'Entendido' }));
  fillForm();
  expect(screen.getByRole('button', { name: 'Ingresar' })).toBeDisabled();
  await act(async () => {
    fireEvent.submit(
      screen.getByRole('button', { name: 'Ingresar' }).closest('form')!
    );
  });
  expect(mockLogin).toHaveBeenCalledTimes(1);
  act(() => {
    jest.setSystemTime(Date.now() + 300000);
    jest.advanceTimersByTime(1000);
  });
  expect(screen.getByRole('button', { name: 'Ingresar' })).toBeEnabled();
});

it('prevents concurrent submits and recovers from a network rejection', async () => {
  let rejectRequest!: (reason?: unknown) => void;
  mockLogin.mockReturnValue(
    new Promise((_, reject) => {
      rejectRequest = reject;
    })
  );
  render(<Login />);
  fillForm();
  const form = screen
    .getByRole('button', { name: 'Ingresar' })
    .closest('form')!;
  await act(async () => {
    fireEvent.submit(form);
    fireEvent.submit(form);
  });
  expect(mockLogin).toHaveBeenCalledTimes(1);
  await act(async () => {
    rejectRequest(new Error('network'));
  });
  expect(screen.getByRole('alertdialog')).toHaveTextContent(
    'No fue posible iniciar sesión'
  );
  fireEvent.click(screen.getByRole('button', { name: 'Entendido' }));
  expect(screen.getByLabelText('Usuario')).toHaveValue('prueba');
});
