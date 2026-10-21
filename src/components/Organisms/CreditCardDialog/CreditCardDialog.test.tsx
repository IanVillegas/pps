import { validateCreditCard } from './CreditCardDialog';
import type { CreditCardItemData } from '@/types/CreditCard.types';

const VALID: CreditCardItemData = {
  period: '2026',
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

  it('takes the period as a year: four digits, with no range', () => {
    expect(
      validateCreditCard({ ...VALID, period: '2026' }).period
    ).toBeUndefined();
    expect(
      validateCreditCard({ ...VALID, period: '1990' }).period
    ).toBeUndefined();
    expect(
      validateCreditCard({ ...VALID, period: '2099' }).period
    ).toBeUndefined();
    expect(validateCreditCard({ ...VALID, period: '' }).period).toBe(
      'El periodo es requerido'
    );
    expect(validateCreditCard({ ...VALID, period: '26' }).period).toBe(
      'Escriba el año con 4 dígitos'
    );
    expect(validateCreditCard({ ...VALID, period: 'Mensual' }).period).toBe(
      'Escriba el año con 4 dígitos'
    );
  });

  it('asks for exactly four digits in the operation number', () => {
    expect(validateCreditCard({ ...VALID, lastFour: '123' }).lastFour).toBe(
      'Escriba los 4 últimos dígitos'
    );
    expect(validateCreditCard({ ...VALID, lastFour: '12a4' }).lastFour).toBe(
      'Escriba los 4 últimos dígitos'
    );
  });

  it('requires every amount, accepting zero and a whole amount from older data', () => {
    const errors = validateCreditCard({
      ...VALID,
      limit: '',
      balanceColones: '',
      installmentDollars: '',
    });
    expect(errors.limit).toBe('El límite de la tarjeta es requerido');
    expect(errors.balanceColones).toBe('El saldo en colones es requerido');
    expect(errors.installmentDollars).toBe('La cuota en dólares es requerida');
    expect(
      validateCreditCard({
        ...VALID,
        limit: '0.00',
        balanceColones: '350000',
        balanceDollars: '1234.56',
      })
    ).toEqual({});
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
