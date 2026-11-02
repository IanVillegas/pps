import {
  fetchCurrentAccountTotals,
  fetchGroupCurrentAccounts,
} from './CurrentAccountsService';

describe('CurrentAccountsService (simulacion del backend)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const settle = async <T>(promise: Promise<T>) => {
    await jest.advanceTimersByTimeAsync(300);
    return promise;
  };

  it('returns the preloaded Grupo Mutual accounts', async () => {
    const accounts = await settle(fetchGroupCurrentAccounts());
    expect(accounts.length).toBeGreaterThan(0);
    expect(accounts[0].entity).toBe('grupo-mutual');
    expect(accounts[0].accountNumber).toBeTruthy();
    expect(accounts[0].holderName).toBeTruthy();
  });

  it('starts from the Grupo Mutual balance when nothing was added', async () => {
    const [groupAccount] = await settle(fetchGroupCurrentAccounts());
    const totals = await settle(fetchCurrentAccountTotals([]));
    expect(totals.colones).toBe(groupAccount.balance);
    expect(totals.dolares).toBe(0);
  });

  it('adds each currency on its own, without mixing or converting', async () => {
    const [groupAccount] = await settle(fetchGroupCurrentAccounts());
    const totals = await settle(
      fetchCurrentAccountTotals([
        { balance: '1000', currency: 'colones' },
        { balance: '250', currency: 'dolares' },
      ])
    );
    expect(totals).toEqual({
      colones: groupAccount.balance + 1000,
      dolares: 250,
    });
  });
});
