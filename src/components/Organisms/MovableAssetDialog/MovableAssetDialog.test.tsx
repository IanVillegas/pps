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

  it('rejects a year outside a reasonable range', () => {
    expect(
      validateMovableAssetItem({ ...VALID, year: '1800' }).year
    ).toBeDefined();
    expect(
      validateMovableAssetItem({
        ...VALID,
        year: String(new Date().getFullYear() + 5),
      }).year
    ).toBeDefined();
    expect(
      validateMovableAssetItem({ ...VALID, year: '2020' }).year
    ).toBeUndefined();
  });

  it('rejects a market value that is not a plain number', () => {
    expect(
      validateMovableAssetItem({ ...VALID, marketValue: '15.000' }).marketValue
    ).toBe('Escriba solo números');
  });
});
