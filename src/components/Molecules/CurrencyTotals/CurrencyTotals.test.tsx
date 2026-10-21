import { render, screen, within } from '@testing-library/react';
import CurrencyTotals from './CurrencyTotals';

const renderTotals = (
  totals?: Parameters<typeof CurrencyTotals>[0]['totals']
) =>
  render(
    <CurrencyTotals
      heading="Saldo de prueba"
      colonesTitle="En colones"
      dolaresTitle="En dólares"
      totals={totals}
    />
  );

describe('CurrencyTotals', () => {
  it('shows the figures of each currency in its own column', () => {
    renderTotals({
      colones: { balance: 1897.45, installments: 1000 },
      dolares: { balance: 20, installments: 3 },
    });
    expect(
      screen.getByRole('region', { name: 'Saldo de prueba' })
    ).toBeInTheDocument();
    const colones = screen.getByRole('heading', { name: 'En colones' })
      .parentElement as HTMLElement;
    expect(within(colones).getByText('₡ 1,897.45')).toBeInTheDocument();
    expect(within(colones).getByText('₡ 1,000.00')).toBeInTheDocument();
    const dolares = screen.getByRole('heading', { name: 'En dólares' })
      .parentElement as HTMLElement;
    expect(within(dolares).getByText('$ 20.00')).toBeInTheDocument();
    expect(within(dolares).getByText('$ 3.00')).toBeInTheDocument();
  });

  it('shows a dash for every figure until the backend answers', () => {
    renderTotals(null);
    expect(screen.getAllByText('—')).toHaveLength(4);
  });
});
