import { validateCurrentAccount } from './CurrentAccountDialog';
import type { CurrentAccountItemData } from '@/types/CurrentAccount.types';

const VALID: CurrentAccountItemData = {
  entity: 'banco-1',
  balance: '350000',
  currency: 'colones',
};

describe('validateCurrentAccount', () => {
  it('requires the three fields', () => {
    const errors = validateCurrentAccount({
      entity: '',
      balance: '',
      currency: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'balance',
      'currency',
      'entity',
    ]);
  });

  it('accepts a complete account', () => {
    expect(validateCurrentAccount(VALID)).toEqual({});
  });

  it('requires the balance, but accepts zero and a whole amount from older data', () => {
    expect(validateCurrentAccount({ ...VALID, balance: '' }).balance).toBe(
      'El saldo actual es requerido'
    );
    expect(
      validateCurrentAccount({ ...VALID, balance: '0.00' }).balance
    ).toBeUndefined();
    expect(
      validateCurrentAccount({ ...VALID, balance: '500000' }).balance
    ).toBeUndefined();
  });
});
