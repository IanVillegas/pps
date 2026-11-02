import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationIntroDialog from './DeclarationIntroDialog';

describe('DeclarationIntroDialog', () => {
  it('shows the title and periodicity text from the design', () => {
    render(<DeclarationIntroDialog open onClose={jest.fn()} />);
    expect(
      screen.getByRole('alertdialog', {
        name: 'Declaración Patrimonial Funcionarios',
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/una vez al año en el mes de enero/)).toBeVisible();
  });

  it('closes with "Entendido", the close icon and Escape', async () => {
    const onClose = jest.fn();
    render(<DeclarationIntroDialog open onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('renders nothing when closed', () => {
    render(<DeclarationIntroDialog open={false} onClose={jest.fn()} />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
