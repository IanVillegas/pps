import { fetchSavingsTotals } from './SavingsTotalsService';

describe('SavingsTotalsService (simulacion del backend)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const resolve = async (
    accounts: Parameters<typeof fetchSavingsTotals>[0]
  ) => {
    const promise = fetchSavingsTotals(accounts);
    await jest.advanceTimersByTimeAsync(300);
    return promise;
  };

  it('returns zero in both currencies when there are no accounts', async () => {
    expect(await resolve([])).toEqual({ colones: 0, dolares: 0 });
  });

  it('adds each currency on its own, without mixing or converting', async () => {
    const totals = await resolve([
      { amount: '1000', currency: 'colones' },
      { amount: '250', currency: 'dolares' },
      { amount: '500', currency: 'colones' },
    ]);
    expect(totals).toEqual({ colones: 1500, dolares: 250 });
  });

  it('ignores accounts with an unknown currency', async () => {
    const totals = await resolve([{ amount: '900', currency: 'euros' }]);
    expect(totals).toEqual({ colones: 0, dolares: 0 });
  });
});
