import { fetchFinancialSummary } from './FinancialSummaryService';

describe('FinancialSummaryService (simulacion del backend)', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  const resolve = async (
    input: Parameters<typeof fetchFinancialSummary>[0]
  ) => {
    const promise = fetchFinancialSummary(input);
    await jest.advanceTimersByTimeAsync(300);
    return promise;
  };

  it('returns the payroll with zero totals when nothing is registered', async () => {
    const summary = await resolve({ additionalIncomes: [], expenses: [] });
    expect(summary.grossSalary).toBeGreaterThan(summary.netSalary);
    expect(summary.totalExpenses).toBe(0);
    expect(summary.monthlyBalance).toBe(summary.netSalary);
    expect(summary.expenseToIncomeRatio).toBe(0);
    expect(summary.creditPaymentToIncomeRatio).toBe(0);
  });

  it('adds extra income and subtracts expenses from the balance', async () => {
    const base = await resolve({ additionalIncomes: [], expenses: [] });
    const summary = await resolve({
      additionalIncomes: [{ amount: '300000' }],
      expenses: [
        { type: 'vivienda', amount: '200000' },
        { type: 'cuotas-creditos', amount: '100000' },
      ],
    });
    expect(summary.totalExpenses).toBe(300000);
    expect(summary.monthlyBalance).toBe(base.netSalary + 300000 - 300000);
  });

  it('rounds the ratios to two decimals and isolates credit payments', async () => {
    const summary = await resolve({
      additionalIncomes: [],
      expenses: [
        { type: 'vivienda', amount: '100000' },
        { type: 'cuotas-creditos', amount: '50000' },
      ],
    });
    // 150000 / 1200000 = 12.5 %; 50000 / 1200000 = 4.1666... -> 4.17 %
    expect(summary.expenseToIncomeRatio).toBe(12.5);
    expect(summary.creditPaymentToIncomeRatio).toBe(4.17);
  });

  it('takes a negative balance when expenses exceed income', async () => {
    const summary = await resolve({
      additionalIncomes: [],
      expenses: [{ type: 'vivienda', amount: '2000000' }],
    });
    expect(summary.monthlyBalance).toBeLessThan(0);
  });
});
