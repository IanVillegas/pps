import { act, renderHook } from '@testing-library/react';
import { useCreditCardsTotals } from './useCreditCardsTotals';
import { fetchCreditCardsTotals } from '@/services/CreditCardsTotalsService';
import type {
  CreditCardItem,
  CreditCardsTotals,
} from '@/types/CreditCard.types';

jest.mock('@/services/CreditCardsTotalsService');

const mockedFetch = jest.mocked(fetchCreditCardsTotals);

// Arreglos estables: el hook vuelve a pedir los totales cuando cambia la
// referencia, asi que un `[]` nuevo en cada render lo dejaria en un ciclo.
const NONE: CreditCardItem[] = [];
const ONE: CreditCardItem[] = [
  {
    id: 'a',
    period: '2026',
    entity: 'banco-1',
    currency: 'colones',
    expiryDate: '2030-01-01',
    limit: '100',
    lastFour: '1234',
    balanceColones: '5',
    installmentColones: '1',
    balanceDollars: '0',
    installmentDollars: '0',
  },
];

const totals = (balance: number): CreditCardsTotals => ({
  colones: { balance, installments: 0 },
  dolares: { balance: 0, installments: 0 },
});

const deferred = () => {
  let resolve!: (value: CreditCardsTotals) => void;
  const promise = new Promise<CreditCardsTotals>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('useCreditCardsTotals', () => {
  it('starts loading and exposes the totals once they arrive', async () => {
    mockedFetch.mockResolvedValue(totals(10));
    const { result } = renderHook(() => useCreditCardsTotals(NONE));
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
      ({ cards }) => useCreditCardsTotals(cards),
      { initialProps: { cards: NONE } }
    );
    rerender({ cards: ONE });

    await act(async () => fast.resolve(totals(2)));
    await act(async () => slow.resolve(totals(1)));

    expect(result.current.totals?.colones.balance).toBe(2);
  });

  it('keeps the last totals and reports error when a refresh fails', async () => {
    mockedFetch.mockResolvedValueOnce(totals(7));
    const { result, rerender } = renderHook(
      ({ cards }) => useCreditCardsTotals(cards),
      { initialProps: { cards: NONE } }
    );
    await act(async () => {});

    mockedFetch.mockRejectedValueOnce(new Error('fail'));
    rerender({ cards: ONE });
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.totals?.colones.balance).toBe(7);
  });
});
