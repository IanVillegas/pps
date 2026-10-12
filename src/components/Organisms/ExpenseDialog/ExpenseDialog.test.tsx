import { validateExpenseItem } from './ExpenseDialog';

describe('validateExpenseItem', () => {
  it('requires type and amount', () => {
    const errors = validateExpenseItem({ type: '', amount: '' });
    expect(Object.keys(errors).sort()).toEqual(['amount', 'type']);
  });

  it('accepts a complete expense', () => {
    expect(validateExpenseItem({ type: 'vivienda', amount: '200000' })).toEqual(
      {}
    );
  });

  it('rejects an amount that is not only digits', () => {
    expect(
      validateExpenseItem({ type: 'vivienda', amount: '2,000' }).amount
    ).toBe('Escriba solo números');
  });
});
