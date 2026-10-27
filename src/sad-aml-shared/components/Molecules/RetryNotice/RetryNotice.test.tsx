import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RetryNotice from './RetryNotice';

describe('RetryNotice', () => {
  it('announces what failed and offers to try again', async () => {
    const onRetry = jest.fn();
    render(<RetryNotice message="No se pudo cargar." onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo cargar.');
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
