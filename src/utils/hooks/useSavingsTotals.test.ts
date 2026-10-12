import { act, renderHook } from '@testing-library/react';
import { useSavingsTotals } from './useSavingsTotals';
import { fetchSavingsTotals } from '@/services/SavingsTotalsService';
import type { SavingsAccountItem, SavingsTotals } from '@/types/Savings.types';

jest.mock('@/services/SavingsTotalsService');

const mockedFetch = jest.mocked(fetchSavingsTotals);

// Arreglos estables: el hook vuelve a pedir los saldos cuando cambia la
// referencia, asi que un `[]` nuevo en cada render lo dejaria en un ciclo.
const NONE: SavingsAccountItem[] = [];
const ONE: SavingsAccountItem[] = [
  {
    id: 'a',
    accountNumber: '1',
    holderName: 'Ana',
    relationship: 'titular',
    amount: '5',
    currency: 'colones',
    entity: 'grupo-mutual',
  },
];

const totals = (colones: number): SavingsTotals => ({ colones, dolares: 0 });

const deferred = () => {
  let resolve!: (value: SavingsTotals) => void;
  const promise = new Promise<SavingsTotals>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('useSavingsTotals', () => {
  it('starts loading and exposes the totals once they arrive', async () => {
    mockedFetch.mockResolvedValue(totals(10));
    const { result } = renderHook(() => useSavingsTotals(NONE));
    expect(result.current.status).toBe('loading');
    await act(async () => {});
    expect(result.current.status).toBe('ready');
    expect(result.current.totals?.colones).toBe(10);
  });

  it('ignores a slow old response that arrives after a newer one', async () => {
    const slow = deferred();
    const fast = deferred();
    mockedFetch
      .mockReturnValueOnce(slow.promise)
      .mockReturnValueOnce(fast.promise);

    const { result, rerender } = renderHook(
      ({ accounts }) => useSavingsTotals(accounts),
      { initialProps: { accounts: NONE } }
    );
    rerender({ accounts: ONE });

    await act(async () => fast.resolve(totals(2)));
    await act(async () => slow.resolve(totals(1)));

    expect(result.current.totals?.colones).toBe(2);
  });

  it('keeps the last totals and reports error when a refresh fails', async () => {
    mockedFetch.mockResolvedValueOnce(totals(7));
    const { result, rerender } = renderHook(
      ({ accounts }) => useSavingsTotals(accounts),
      { initialProps: { accounts: NONE } }
    );
    await act(async () => {});

    mockedFetch.mockRejectedValueOnce(new Error('fail'));
    rerender({ accounts: ONE });
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.totals?.colones).toBe(7);
  });
});
