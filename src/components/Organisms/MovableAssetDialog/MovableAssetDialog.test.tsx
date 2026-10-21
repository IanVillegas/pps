import { validateMovableAssetItem } from './MovableAssetDialog';
import type { MovableAssetItemData } from '@/types/MovableAsset.types';

const VALID: MovableAssetItemData = {
  type: 'vehiculo',
  brand: 'bmw',
  plate: 'IAN123',
  year: '2026',
  marketValue: '15000000',
  description: 'Sedán 4 puertas',
  observation: 'Sin gravámenes',
};

describe('validateMovableAssetItem', () => {
  it('requires the seven fields', () => {
    const errors = validateMovableAssetItem({
      type: '',
      brand: '',
      plate: '',
      year: '',
      marketValue: '',
      description: '',
      observation: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'brand',
      'description',
      'marketValue',
      'observation',
      'plate',
      'type',
      'year',
    ]);
  });

  it('accepts a complete item', () => {
    expect(validateMovableAssetItem(VALID)).toEqual({});
  });

  it('treats a blank plate as missing', () => {
    expect(validateMovableAssetItem({ ...VALID, plate: '   ' }).plate).toBe(
      'El número de placa es requerido'
    );
  });

  it('does not limit the year to a range, only requires digits', () => {
    expect(
      validateMovableAssetItem({ ...VALID, year: '1800' }).year
    ).toBeUndefined();
    expect(
      validateMovableAssetItem({ ...VALID, year: '2099' }).year
    ).toBeUndefined();
    expect(validateMovableAssetItem({ ...VALID, year: '20a0' }).year).toBe(
      'Escriba solo números'
    );
  });

  it('requires the market value, but accepts zero and a whole amount from older data', () => {
    expect(
      validateMovableAssetItem({ ...VALID, marketValue: '' }).marketValue
    ).toBe('El valor de mercado es requerido');
    expect(
      validateMovableAssetItem({ ...VALID, marketValue: '0.00' }).marketValue
    ).toBeUndefined();
    expect(
      validateMovableAssetItem({ ...VALID, marketValue: '15000000' })
        .marketValue
    ).toBeUndefined();
  });
});
