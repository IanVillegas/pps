import { validateIncomeItem } from './IncomeDialog';

const VALID = {
  type: 'alquileres',
  amount: '350000',
  justification: 'Alquiler de un apartamento',
};

describe('validateIncomeItem', () => {
  it('requires type, amount and justification', () => {
    const errors = validateIncomeItem({
      type: '',
      amount: '',
      justification: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'amount',
      'justification',
      'type',
    ]);
  });

  it('accepts a complete income', () => {
    expect(validateIncomeItem(VALID)).toEqual({});
  });

  it('treats a blank justification as missing', () => {
    expect(
      validateIncomeItem({ ...VALID, justification: '   ' }).justification
    ).toBe('La justificación es requerida');
  });

  it('rejects an amount that is not only digits', () => {
    expect(validateIncomeItem({ ...VALID, amount: '12a' }).amount).toBe(
      'Escriba solo números'
    );
  });
});
