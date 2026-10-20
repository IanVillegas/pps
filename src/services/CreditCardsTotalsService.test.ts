import { fetchCreditCardsTotals } from './CreditCardsTotalsService';

describe('CreditCardsTotalsService (simulacion del backend)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const resolve = async (
    cards: Parameters<typeof fetchCreditCardsTotals>[0]
  ) => {
    const promise = fetchCreditCardsTotals(cards);
    await jest.advanceTimersByTimeAsync(300);
    return promise;
  };

  it('returns zero balance and installments in both currencies when there are no cards', async () => {
    expect(await resolve([])).toEqual({
      colones: { balance: 0, installments: 0 },
      dolares: { balance: 0, installments: 0 },
    });
  });

  it('adds the colones and dollars columns of every card on their own, without converting', async () => {
    const totals = await resolve([
      {
        balanceColones: '1000',
        installmentColones: '100',
        balanceDollars: '10',
        installmentDollars: '1',
      },
      {
        balanceColones: '500',
        installmentColones: '50',
        balanceDollars: '0',
        installmentDollars: '0',
      },
    ]);
    expect(totals).toEqual({
      colones: { balance: 1500, installments: 150 },
      dolares: { balance: 10, installments: 1 },
    });
  });
});
