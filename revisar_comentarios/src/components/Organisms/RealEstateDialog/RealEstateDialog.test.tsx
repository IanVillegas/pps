import { validateRealEstateItem } from './RealEstateDialog';
import type { RealEstateItemData } from '@/types/RealEstate.types';

const VALID: RealEstateItemData = {
  fincaNumber: '123456789',
  location: 'Guácima arriba',
  marketValue: '45000000',
  destination: 'vivienda',
  acquisitionForm: 'Compra',
};

describe('validateRealEstateItem', () => {
  it('requires the five fields', () => {
    const errors = validateRealEstateItem({
      fincaNumber: '',
      location: '',
      marketValue: '',
      destination: '',
      acquisitionForm: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'acquisitionForm',
      'destination',
      'fincaNumber',
      'location',
      'marketValue',
    ]);
  });

  it('accepts a complete item', () => {
    expect(validateRealEstateItem(VALID)).toEqual({});
  });

  it('treats a blank finca number as missing', () => {
    expect(
      validateRealEstateItem({ ...VALID, fincaNumber: '   ' }).fincaNumber
    ).toBe('El número de finca es requerido');
  });

  it('requires the market value, accepting an amount with cents and a whole amount from older data', () => {
    expect(
      validateRealEstateItem({ ...VALID, marketValue: '' }).marketValue
    ).toBe('El valor de mercado es requerido');
    expect(
      validateRealEstateItem({ ...VALID, marketValue: '45000.50' }).marketValue
    ).toBeUndefined();
    expect(
      validateRealEstateItem({ ...VALID, marketValue: '45000000' }).marketValue
    ).toBeUndefined();
  });

  it('accepts a market value of zero', () => {
    expect(
      validateRealEstateItem({ ...VALID, marketValue: '0' }).marketValue
    ).toBeUndefined();
  });
});
