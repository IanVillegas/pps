import { validateCreditCard } from './CreditCardDialog';
import type { CreditCardItemData } from '@/types/CreditCard.types';

const VALID: CreditCardItemData = {
  period: 'Mensual',
  entity: 'grupo-mutual',
  currency: 'colones',
  expiryDate: '2028-05-20',
  limit: '2000000',
  lastFour: '1234',
  balanceColones: '350000',
  installmentColones: '25000',
  balanceDollars: '0',
  installmentDollars: '0',
};

describe('validateCreditCard', () => {
  it('requires the ten fields', () => {
    const errors = validateCreditCard({
      period: '',
      entity: '',
      currency: '',
      expiryDate: '',
      limit: '',
      lastFour: '',
      balanceColones: '',
      installmentColones: '',
      balanceDollars: '',
      installmentDollars: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'balanceColones',
      'balanceDollars',
      'currency',
      'entity',
      'expiryDate',
      'installmentColones',
      'installmentDollars',
      'lastFour',
      'limit',
      'period',
    ]);
  });

  it('accepts a complete card', () => {
    expect(validateCreditCard(VALID)).toEqual({});
  });

  it('asks for exactly four digits in the operation number', () => {
    expect(validateCreditCard({ ...VALID, lastFour: '123' }).lastFour).toBe(
      'Escriba los 4 últimos dígitos'
    );
    expect(validateCreditCard({ ...VALID, lastFour: '12a4' }).lastFour).toBe(
      'Escriba los 4 últimos dígitos'
    );
  });

  it('rejects amounts that are not only digits', () => {
    const errors = validateCreditCard({
      ...VALID,
      limit: '1.5',
      balanceColones: '2,000',
      installmentDollars: '10a',
    });
    expect(errors.limit).toBe('Escriba solo números');
    expect(errors.balanceColones).toBe('Escriba solo números');
    expect(errors.installmentDollars).toBe('Escriba solo números');
  });

  it('asks for a valid date when what was typed is not a real date', () => {
    expect(
      validateCreditCard({ ...VALID, expiryDate: '', expiryDateInvalid: true })
        .expiryDate
    ).toBe('Escriba una fecha válida');
  });

  it('accepts a past or a far future expiry date, with no limit', () => {
    expect(
      validateCreditCard({ ...VALID, expiryDate: '2001-01-01' }).expiryDate
    ).toBeUndefined();
    expect(
      validateCreditCard({ ...VALID, expiryDate: '2099-12-31' }).expiryDate
    ).toBeUndefined();
  });
});
