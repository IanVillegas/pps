import { act, renderHook } from '@testing-library/react';
import { useCurrentAccounts } from './useCurrentAccounts';
import {
  fetchCurrentAccountTotals,
  fetchGroupCurrentAccounts,
} from '@/services/CurrentAccountsService';
import type {
  CurrentAccountItem,
  CurrentAccountTotals,
  GroupCurrentAccount,
} from '@/types/CurrentAccount.types';

jest.mock('@/services/CurrentAccountsService');

const mockedGroup = jest.mocked(fetchGroupCurrentAccounts);
const mockedTotals = jest.mocked(fetchCurrentAccountTotals);

// Arreglos estables: el hook vuelve a pedir los saldos cuando cambia la
// referencia, asi que un `[]` nuevo en cada render lo dejaria en un ciclo.
const NONE: CurrentAccountItem[] = [];
const ONE: CurrentAccountItem[] = [
  { id: 'a', entity: 'banco-1', balance: '5', currency: 'colones' },
];

const GROUP: GroupCurrentAccount = {
  id: 'g',
  accountNumber: '1',
  holderName: 'Titular',
  relationship: 'titular',
  balance: 10,
  currency: 'colones',
  entity: 'grupo-mutual',
};
const totals = (colones: number): CurrentAccountTotals => ({
  colones,
  dolares: 0,
});

const deferred = () => {
  let resolve!: (value: CurrentAccountTotals) => void;
  const promise = new Promise<CurrentAccountTotals>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

describe('useCurrentAccounts', () => {
  beforeEach(() => mockedGroup.mockResolvedValue([GROUP]));

  it('starts loading and exposes the group accounts and totals once they arrive', async () => {
    mockedTotals.mockResolvedValue(totals(10));
    const { result } = renderHook(() => useCurrentAccounts(NONE));
    expect(result.current.groupStatus).toBe('loading');
    expect(result.current.totalsStatus).toBe('loading');
    await act(async () => {});
    expect(result.current.groupAccounts).toEqual([GROUP]);
    expect(result.current.totals?.colones).toBe(10);
    expect(result.current.totalsStatus).toBe('ready');
  });

  it('asks for the group accounts only once, even when the added ones change', async () => {
    mockedGroup.mockClear();
    mockedTotals.mockClear();
    mockedTotals.mockResolvedValue(totals(1));
    const { rerender } = renderHook(({ added }) => useCurrentAccounts(added), {
      initialProps: { added: NONE },
    });
    await act(async () => {});
    rerender({ added: ONE });
    await act(async () => {});
    expect(mockedGroup).toHaveBeenCalledTimes(1);
    expect(mockedTotals).toHaveBeenCalledTimes(2);
  });

  it('ignores a slow old totals response that arrives after a newer one', async () => {
    const slow = deferred();
    const fast = deferred();
    mockedTotals
      .mockReturnValueOnce(slow.promise)
      .mockReturnValueOnce(fast.promise);
    const { result, rerender } = renderHook(
      ({ added }) => useCurrentAccounts(added),
      { initialProps: { added: NONE } }
    );
    rerender({ added: ONE });

    await act(async () => fast.resolve(totals(2)));
    await act(async () => slow.resolve(totals(1)));

    expect(result.current.totals?.colones).toBe(2);
  });

  it('keeps the last totals and reports error when a refresh fails', async () => {
    mockedTotals.mockResolvedValueOnce(totals(7));
    const { result, rerender } = renderHook(
      ({ added }) => useCurrentAccounts(added),
      { initialProps: { added: NONE } }
    );
    await act(async () => {});

    mockedTotals.mockRejectedValueOnce(new Error('fail'));
    rerender({ added: ONE });
    await act(async () => {});

    expect(result.current.totalsStatus).toBe('error');
    expect(result.current.totals?.colones).toBe(7);
  });

  it('reports an error for the group accounts without losing the rest', async () => {
    mockedGroup.mockRejectedValue(new Error('fail'));
    mockedTotals.mockResolvedValue(totals(3));
    const { result } = renderHook(() => useCurrentAccounts(NONE));
    await act(async () => {});
    expect(result.current.groupStatus).toBe('error');
    expect(result.current.groupAccounts).toBeNull();
    expect(result.current.totals?.colones).toBe(3);
  });
});
