import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppShell from './AppShell';
import {
  endSession,
  getSession,
  startMockSession,
  subscribeSession,
} from '@/services/SessionService';

jest.mock('next/navigation', () => ({ usePathname: () => '/inicio' }));

// jest.setup.ts registra un `matchMedia` que siempre devuelve
// matches:false; estas pruebas lo sobreescriben para simular tablet.
const mockMatchMedia = (matches: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const mql = {
    matches,
    media: '(max-width: 1100px)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void
    ) => listeners.add(listener),
    removeEventListener: (
      _: string,
      listener: (event: MediaQueryListEvent) => void
    ) => listeners.delete(listener),
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
  window.matchMedia = jest.fn().mockReturnValue(mql);
  return {
    // Simula cruzar el breakpoint (evento 'change' real del navegador).
    change: (next: boolean) => {
      (mql as { matches: boolean }).matches = next;
      listeners.forEach(listener =>
        listener({ matches: next } as MediaQueryListEvent)
      );
    },
  };
};

it('toggles the sidebar between expanded and collapsed, keeping the link name accessible', async () => {
  render(
    <AppShell
      user={{ username: 'demo', displayName: 'Prueba' }}
      onLogout={jest.fn()}
    >
      {null}
    </AppShell>
  );
  const toggle = screen.getByRole('button', { name: 'Colapsar menú' });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();

  await userEvent.click(toggle);
  expect(screen.getByRole('button', { name: 'Expandir menú' })).toHaveAttribute(
    'aria-expanded',
    'false'
  );
  // El nombre accesible del enlace se conserva aunque el texto quede oculto
  // visualmente (ver sideBar__labelHidden).
  expect(screen.getByRole('link', { name: 'Inicio' })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: 'Expandir menú' }));
  expect(screen.getByRole('button', { name: 'Colapsar menú' })).toHaveAttribute(
    'aria-expanded',
    'true'
  );
});

it('starts collapsed on tablet and re-syncs when crossing the breakpoint', () => {
  const media = mockMatchMedia(true);
  render(
    <AppShell
      user={{ username: 'demo', displayName: 'Prueba' }}
      onLogout={jest.fn()}
    >
      {null}
    </AppShell>
  );
  expect(
    screen.getByRole('button', { name: 'Expandir menú' })
  ).toBeInTheDocument();

  act(() => media.change(false));
  expect(
    screen.getByRole('button', { name: 'Colapsar menú' })
  ).toBeInTheDocument();
});

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
