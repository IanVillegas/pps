import { act, renderHook } from '@testing-library/react';
import { useFinancialSummary } from './useFinancialSummary';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type {
  ExpenseItem,
  FinancialSummary,
} from '@/types/IncomeExpenses.types';

jest.mock('@/services/FinancialSummaryService');

const mockedFetch = jest.mocked(fetchFinancialSummary);

const summary = (monthlyBalance: number): FinancialSummary => ({
  grossSalary: 0,
  netSalary: 0,
  totalExpenses: 0,
  monthlyBalance,
  expenseToIncomeRatio: 0,
  creditPaymentToIncomeRatio: 0,
});

const deferred = () => {
  let resolve!: (value: FinancialSummary) => void;
  const promise = new Promise<FinancialSummary>(r => {
    resolve = r;
  });
  return { promise, resolve };
};

// Arreglos estables: el hook vuelve a pedir el resumen cuando cambia la
// referencia, asi que un `[]` nuevo en cada render lo dejaria en un ciclo.
const NONE: never[] = [];

describe('useFinancialSummary', () => {
  it('starts loading and exposes the summary once it arrives', async () => {
    mockedFetch.mockResolvedValue(summary(10));
    const { result } = renderHook(() => useFinancialSummary(NONE, NONE));
    expect(result.current.status).toBe('loading');
    await act(async () => {});
    expect(result.current.status).toBe('ready');
    expect(result.current.summary?.monthlyBalance).toBe(10);
  });

  it('ignores a slow old response that arrives after a newer one', async () => {
    const slow = deferred();
    const fast = deferred();
    mockedFetch
      .mockReturnValueOnce(slow.promise)
      .mockReturnValueOnce(fast.promise);

    const first: ExpenseItem[] = [];
    const second: ExpenseItem[] = [{ id: 'a', type: 'vivienda', amount: '5' }];
    const { result, rerender } = renderHook(
      ({ expenses }) => useFinancialSummary(NONE, expenses),
      { initialProps: { expenses: first } }
    );
    rerender({ expenses: second });

    await act(async () => fast.resolve(summary(2)));
    await act(async () => slow.resolve(summary(1)));

    expect(result.current.summary?.monthlyBalance).toBe(2);
  });

  it('keeps the last summary and reports error when a refresh fails', async () => {
    mockedFetch.mockResolvedValueOnce(summary(7));
    const { result, rerender } = renderHook(
      ({ expenses }) => useFinancialSummary(NONE, expenses),
      { initialProps: { expenses: [] as ExpenseItem[] } }
    );
    await act(async () => {});

    mockedFetch.mockRejectedValueOnce(new Error('fail'));
    rerender({ expenses: [{ id: 'a', type: 'vivienda', amount: '5' }] });
    await act(async () => {});

    expect(result.current.status).toBe('error');
    expect(result.current.summary?.monthlyBalance).toBe(7);
  });
});
