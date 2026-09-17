import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './Home';

let demoParam: string | null = null;

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (key: string) => (key === 'demo' ? demoParam : null),
  }),
}));

describe('Home', () => {
  beforeEach(() => {
    demoParam = null;
  });

  it('shows the welcome content and both info cards', () => {
    render(<Home />);
    expect(screen.getByText('Bienvenido a DecPat')).toBeInTheDocument();
    expect(screen.getByText('¿Qué es?')).toBeInTheDocument();
    expect(screen.getByText('¿Necesitas ayuda?')).toBeInTheDocument();
    expect(
      screen.queryByText('Ha ocurrido un error.', { exact: false })
    ).not.toBeInTheDocument();
  });

  it('opens the help dialog from "Contactos" and closes it', async () => {
    render(<Home />);
    await userEvent.click(screen.getByRole('button', { name: 'Contactos' }));
    expect(screen.getByText('Contacto de ayuda')).toBeInTheDocument();
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Entendido' })[0]
    );
    expect(screen.queryByText('Contacto de ayuda')).not.toBeInTheDocument();
  });

  it('shows the recoverable error state when ?demo=error and recovers on "Entendido"', async () => {
    demoParam = 'error';
    render(<Home />);
    expect(
      screen.getByText('Ha ocurrido un error.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.queryByText('Bienvenido a DecPat')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(screen.getByText('Bienvenido a DecPat')).toBeInTheDocument();
    expect(
      screen.queryByText('Ha ocurrido un error.', { exact: false })
    ).not.toBeInTheDocument();
  });

  it('shows the recoverable error state from the dev-only trigger button', async () => {
    render(<Home />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Simular error (solo desarrollo)' })
    );
    expect(
      screen.getByText('Ha ocurrido un error.', { exact: false })
    ).toBeInTheDocument();
  });
});
