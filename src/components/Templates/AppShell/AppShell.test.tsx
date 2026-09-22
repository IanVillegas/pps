import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppShell from './AppShell';
import {
  endSession,
  getSession,
  startMockSession,
  subscribeSession,
} from '@/services/SessionService';

jest.mock('next/navigation', () => ({ usePathname: () => '/inicio' }));

it('shows user data and only routes that exist', () => {
  render(
    <AppShell
      user={{ username: 'demo', displayName: 'Nombre de prueba' }}
      onLogout={jest.fn()}
    >
      <p>Contenido</p>
    </AppShell>
  );
  expect(screen.getByText('Nombre de prueba')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute(
    'aria-current',
    'page'
  );
  expect(screen.getByRole('link', { name: 'Mi declaración' })).toHaveAttribute(
    'href',
    '/mi-declaracion/1'
  );
  expect(screen.getByRole('button', { name: 'Reportes' })).toBeDisabled();
  expect(screen.getByRole('main')).toHaveTextContent('Contenido');
});

it('opens the profile menu by keyboard and invokes logout', async () => {
  const logout = jest.fn();
  render(
    <AppShell
      user={{ username: 'demo', displayName: 'Prueba' }}
      onLogout={logout}
    >
      {null}
    </AppShell>
  );
  screen.getByRole('button', { name: 'Menú de usuario' }).focus();
  await userEvent.keyboard('{Enter}');
  const item = await screen.findByRole('menuitem', { name: 'Cerrar sesión' });
  item.focus();
  await userEvent.keyboard('{Enter}');
  expect(logout).toHaveBeenCalledTimes(1);
});

it('ends the mock session without erasing the remembered username', () => {
  window.localStorage.setItem('decpat.rememberedUsername', 'demo');
  const listener = jest.fn();
  const unsubscribe = subscribeSession(listener);
  startMockSession('demo');
  expect(getSession()).toEqual({ username: 'demo', displayName: 'demo' });
  endSession();
  expect(getSession()).toBeNull();
  expect(listener).toHaveBeenCalledTimes(2);
  expect(window.localStorage.getItem('decpat.rememberedUsername')).toBe('demo');
  unsubscribe();
  window.localStorage.clear();
});
