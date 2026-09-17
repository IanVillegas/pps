import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HelpDialog, { HELP_EMAIL, HELP_PHONE } from './HelpDialog';

describe('HelpDialog', () => {
  it('shows the contact email and phone from Figma when open', () => {
    render(<HelpDialog open onClose={jest.fn()} />);
    expect(screen.getByText('Contacto de ayuda')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: HELP_EMAIL })).toHaveAttribute(
      'href',
      `mailto:${HELP_EMAIL}`
    );
    expect(screen.getByRole('link', { name: HELP_PHONE })).toHaveAttribute(
      'href',
      `tel:${HELP_PHONE}`
    );
  });

  it('does not render anything when closed', () => {
    render(<HelpDialog open={false} onClose={jest.fn()} />);
    expect(screen.queryByText('Contacto de ayuda')).not.toBeInTheDocument();
  });

  it('calls onClose from the "Entendido" button', async () => {
    const onClose = jest.fn();
    render(<HelpDialog open onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Entendido' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose from Escape', async () => {
    const onClose = jest.fn();
    render(<HelpDialog open onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
