import { validateSavingsAccount } from './SavingsDialog';
import type { SavingsAccountItemData } from '@/types/Savings.types';

const VALID: SavingsAccountItemData = {
  accountNumber: '000123456789',
  holderName: 'Ana Mora',
  relationship: 'titular',
  amount: '1500000',
  currency: 'colones',
  entity: 'grupo-mutual',
};

describe('validateSavingsAccount', () => {
  it('requires the six fields', () => {
    const errors = validateSavingsAccount({
      accountNumber: '',
      holderName: '',
      relationship: '',
      amount: '',
      currency: '',
      entity: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'accountNumber',
      'amount',
      'currency',
      'entity',
      'holderName',
      'relationship',
    ]);
  });

  it('accepts a complete account', () => {
    expect(validateSavingsAccount(VALID)).toEqual({});
  });

  it('treats a blank holder name as missing', () => {
    expect(
      validateSavingsAccount({ ...VALID, holderName: '   ' }).holderName
    ).toBe('El nombre del titular es requerido');
  });

  it('accepts an account or title number that is not only digits', () => {
    expect(
      validateSavingsAccount({ ...VALID, accountNumber: 'CR05-0152 / T-77' })
        .accountNumber
    ).toBeUndefined();
  });

  it('rejects an amount that is not only digits', () => {
    expect(validateSavingsAccount({ ...VALID, amount: '1.5' }).amount).toBe(
      'Escriba solo números'
    );
  });
});
