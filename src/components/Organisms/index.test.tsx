import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './index';

// El retorno de foco al cerrar no se prueba aqui: jsdom no simula de forma
// confiable el manejo de foco async de Radix. Lo que sigue es lo que si es
// confiable en jsdom.

describe('Modal', () => {
  it('calls onOpenChange(false) on Escape', async () => {
    const onOpenChange = jest.fn();
    render(
      <Modal
        open
        onOpenChange={onOpenChange}
        title="Titulo"
        description="Descripcion"
      />
    );
    await userEvent.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('gives the close button an accessible name', () => {
    render(<Modal open title="Titulo" description="Descripcion" />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it('renders a string description without an invalid <p><div> nesting', () => {
    render(<Modal open title="Titulo" description="Descripcion de prueba" />);
    const description = screen.getByText('Descripcion de prueba');
    expect(description.tagName).toBe('P');
    expect(description.querySelector('div')).toBeNull();
  });

  it('does not render anything when closed', () => {
    render(<Modal open={false} title="Titulo" description="Descripcion" />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
