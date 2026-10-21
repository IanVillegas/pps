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

  it('requires the amount, but accepts zero and a whole amount from older data', () => {
    expect(validateExpenseItem({ type: 'vivienda', amount: '' }).amount).toBe(
      'El monto es requerido'
    );
    expect(
      validateExpenseItem({ type: 'vivienda', amount: '0.00' }).amount
    ).toBeUndefined();
    expect(
      validateExpenseItem({ type: 'vivienda', amount: '90000' }).amount
    ).toBeUndefined();
  });
});
