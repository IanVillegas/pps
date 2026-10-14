import { act, renderHook } from '@testing-library/react';
import { useCreditsTotals } from './useCreditsTotals';
import { fetchCreditsTotals } from '@/services/CreditsTotalsService';
import type { CreditItem, CreditsTotals } from '@/types/Credit.types';

jest.mock('@/services/CreditsTotalsService');

const mockedFetch = jest.mocked(fetchCreditsTotals);

// Arreglos estables: el hook vuelve a pedir los totales cuando cambia la
// referencia, asi que un `[]` nuevo en cada render lo dejaria en un ciclo.
const NONE: CreditItem[] = [];
const ONE: CreditItem[] = [
  {
    id: 'a',
    entity: 'banco-1',
    loanType: 'Personal',
    initialAmount: '10',
    currentBalance: '5',
    installment: '1',
    loanNumber: '1',
    currency: 'colones',
    endDate: '2030-01-01',
  },
];

const totals = (balance: number): CreditsTotals => ({
  colones: { balance, installments: 0 },
  dolares: { balance: 0, installments: 0 },
});

const deferred = () => {
  let resolve!: (value: CreditsTotals) => void;
  const promise = new Promise<CreditsTotals>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('useCreditsTotals', () => {
  it('starts loading and exposes the totals once they arrive', async () => {
    mockedFetch.mockResolvedValue(totals(10));
    const { result } = renderHook(() => useCreditsTotals(NONE));
    expect(result.current.status).toBe('loading');
    await act(async () => {});
    expect(result.current.status).toBe('ready');
    expect(result.current.totals?.colones.balance).toBe(10);
  });

  it('ignores a slow old response that arrives after a newer one', async () => {
    const slow = deferred();
    const fast = deferred();
    mockedFetch
      .mockReturnValueOnce(slow.promise)
      .mockReturnValueOnce(fast.promise);

    const { result, rerender } = renderHook(
      ({ credits }) => useCreditsTotals(credits),
      { initialProps: { credits: NONE } }
    );
    rerender({ credits: ONE });

    await act(async () => fast.resolve(totals(2)));
    await act(async () => slow.resolve(totals(1)));

    expect(result.current.totals?.colones.balance).toBe(2);
  });

  it('keeps the last totals and reports error when a refresh fails', async () => {
    mockedFetch.mockResolvedValueOnce(totals(7));
    const { result, rerender } = renderHook(
      ({ credits }) => useCreditsTotals(credits),
      { initialProps: { credits: NONE } }
    );
    await act(async () => {});

    mockedFetch.mockRejectedValueOnce(new Error('fail'));
    rerender({ credits: ONE });
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.totals?.colones.balance).toBe(7);
  });
});
