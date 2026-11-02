import { validateCredit } from './CreditDialog';
import type { CreditItemData } from '@/types/Credit.types';

const VALID: CreditItemData = {
  entity: 'grupo-mutual',
  loanType: 'Personal',
  initialAmount: '5000000',
  currentBalance: '3200000',
  installment: '150000',
  loanNumber: 'OP-2024-0001',
  currency: 'colones',
  endDate: '2027-05-20',
};

describe('validateCredit', () => {
  it('requires the eight fields', () => {
    const errors = validateCredit({
      entity: '',
      loanType: '',
      initialAmount: '',
      currentBalance: '',
      installment: '',
      loanNumber: '',
      currency: '',
      endDate: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'currency',
      'currentBalance',
      'endDate',
      'entity',
      'initialAmount',
      'installment',
      'loanNumber',
      'loanType',
    ]);
  });

  it('accepts a complete credit', () => {
    expect(validateCredit(VALID)).toEqual({});
  });

  it('accepts a loan number that is not only digits', () => {
    expect(
      validateCredit({ ...VALID, loanNumber: 'CR-77/2024' }).loanNumber
    ).toBeUndefined();
  });

  it('requires the three amounts, accepting zero and a whole amount from older data', () => {
    const errors = validateCredit({
      ...VALID,
      initialAmount: '',
      currentBalance: '',
      installment: '',
    });
    expect(errors.initialAmount).toBe('El monto inicial es requerido');
    expect(errors.currentBalance).toBe('El saldo actual es requerido');
    expect(errors.installment).toBe('El monto de la cuota es requerido');
    expect(
      validateCredit({
        ...VALID,
        initialAmount: '0.00',
        currentBalance: '3200000',
        installment: '1234.56',
      })
    ).toEqual({});
  });

  it('asks for a valid date when what was typed is not a real date', () => {
    expect(
      validateCredit({ ...VALID, endDate: '', endDateInvalid: true }).endDate
    ).toBe('Escriba una fecha válida');
  });

  it('accepts a past or a far future end date, with no limit', () => {
    expect(
      validateCredit({ ...VALID, endDate: '2001-01-01' }).endDate
    ).toBeUndefined();
    expect(
      validateCredit({ ...VALID, endDate: '2099-12-31' }).endDate
    ).toBeUndefined();
  });
});
