import { fetchCreditsTotals } from './CreditsTotalsService';

describe('CreditsTotalsService (simulacion del backend)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const resolve = async (credits: Parameters<typeof fetchCreditsTotals>[0]) => {
    const promise = fetchCreditsTotals(credits);
    await jest.advanceTimersByTimeAsync(300);
    return promise;
  };

  it('returns zero balance and installments in both currencies when there are no credits', async () => {
    expect(await resolve([])).toEqual({
      colones: { balance: 0, installments: 0 },
      dolares: { balance: 0, installments: 0 },
    });
  });

  it('adds balances and installments of each currency on their own, without mixing or converting', async () => {
    const totals = await resolve([
      { currentBalance: '1000', installment: '100', currency: 'colones' },
      { currentBalance: '250', installment: '25', currency: 'dolares' },
      { currentBalance: '500', installment: '50', currency: 'colones' },
    ]);
    expect(totals).toEqual({
      colones: { balance: 1500, installments: 150 },
      dolares: { balance: 250, installments: 25 },
    });
  });

  it('ignores credits with an unknown currency', async () => {
    const totals = await resolve([
      { currentBalance: '900', installment: '90', currency: 'euros' },
    ]);
    expect(totals.colones.balance).toBe(0);
    expect(totals.dolares.balance).toBe(0);
  });
});
