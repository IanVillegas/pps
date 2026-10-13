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

  it('rejects a balance that is not only digits', () => {
    expect(validateCurrentAccount({ ...VALID, balance: '1.5' }).balance).toBe(
      'Escriba solo números'
    );
  });
});
