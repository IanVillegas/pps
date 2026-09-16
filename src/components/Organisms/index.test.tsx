import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './index';

// sad-aml-shared esta excluido de Jest; las pruebas de lo que se corrigio ahi
// (DEC-002D) viven aqui, importando el barril. El retorno de foco al cerrar
// se verifico a mano en el navegador (jsdom no simula de forma confiable el
// manejo de foco async de Radix); lo que sigue es lo que si es confiable en
// jsdom.

describe('Modal (DEC-002D, fix en sad-aml-shared)', () => {
  it('closes on Escape (onOpenChange se llama con false)', async () => {
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

  it('the close button has an accessible name (antes no tenia ninguna)', () => {
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
