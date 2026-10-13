import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppDialog from './AppDialog';

const renderDialog = (
  props: Partial<React.ComponentProps<typeof AppDialog>> = {}
) => {
  const onClose = jest.fn();
  render(
    <AppDialog
      open
      onClose={onClose}
      size="lg"
      title="Datos del bien"
      srDescription="Complete los datos."
      footer={<button type="button">Aceptar</button>}
      {...props}
    >
      <p>Contenido del formulario</p>
    </AppDialog>
  );
  return { onClose };
};

describe('AppDialog', () => {
  it('shows the title, the content and the footer inside an alert dialog named after the title', () => {
    renderDialog();
    expect(
      screen.getByRole('alertdialog', { name: 'Datos del bien' })
    ).toBeInTheDocument();
    expect(screen.getByText('Contenido del formulario')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();
  });

  it('puts the footer in the same scrolling area as the content', () => {
    renderDialog();
    const scroll = screen
      .getByText('Contenido del formulario')
      .closest('[class*="dialog__scroll"]');
    expect(scroll).not.toBeNull();
    expect(scroll).toContainElement(
      screen.getByRole('button', { name: 'Aceptar' })
    );
  });

  it('keeps the description for screen readers only when given as srDescription', () => {
    renderDialog();
    const description = screen.getByText('Complete los datos.');
    expect(description.className).toMatch(/srOnly/);
    expect(screen.getByRole('alertdialog')).toHaveAccessibleDescription(
      'Complete los datos.'
    );
  });

  it('shows a visible description with the class the caller gives', () => {
    renderDialog({
      srDescription: undefined,
      description: 'Texto visible',
      descriptionClassName: 'mi-descripcion',
    });
    const description = screen.getByText('Texto visible');
    expect(description).toHaveClass('mi-descripcion');
    expect(description.className).not.toMatch(/srOnly/);
  });

  it('calls onClose with the X button and with Escape', async () => {
    const { onClose } = renderDialog();
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('applies the width of the chosen size', () => {
    renderDialog({ size: 'sm' });
    expect(screen.getByRole('alertdialog').className).toMatch(/dialog--sm/);
  });

  it('can hide the title visually without removing it from the dialog name', () => {
    renderDialog({ hideTitle: true });
    expect(screen.getByText('Datos del bien').className).toMatch(/srOnly/);
    expect(
      screen.getByRole('alertdialog', { name: 'Datos del bien' })
    ).toBeInTheDocument();
  });

  it('shows the media (icon or logo) above the title', () => {
    renderDialog({ media: <i data-testid="media" /> });
    const heading = screen.getByRole('heading', { name: 'Datos del bien' });
    expect(heading).toContainElement(screen.getByTestId('media'));
  });

  it('works without a footer', () => {
    renderDialog({ footer: undefined });
    expect(
      screen.queryByRole('button', { name: 'Aceptar' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Contenido del formulario')).toBeInTheDocument();
  });
});
