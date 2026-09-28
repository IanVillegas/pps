import { validateFamilyMember } from './FamilyDialog';
import type { FamilyMember, FamilyMemberData } from '@/types/Family.types';

const VALID: FamilyMemberData = {
  fullName: 'Ana Mora',
  age: '28',
  relationship: 'hijo',
  gender: 'femenino',
  birthDate: '1998-12-15',
};

const existing: FamilyMember = { ...VALID, id: 'a' };

describe('validateFamilyMember', () => {
  it('requires the five fields', () => {
    const errors = validateFamilyMember({
      fullName: '',
      age: '',
      relationship: '',
      gender: '',
      birthDate: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'age',
      'birthDate',
      'fullName',
      'gender',
      'relationship',
    ]);
  });

  it('accepts a complete member', () => {
    expect(validateFamilyMember(VALID)).toEqual({});
  });

  it('treats a blank name as missing', () => {
    expect(validateFamilyMember({ ...VALID, fullName: '   ' }).fullName).toBe(
      'El nombre y los apellidos son requeridos'
    );
  });

  it('rejects an age that is not a number or is out of range', () => {
    expect(validateFamilyMember({ ...VALID, age: 'abc' }).age).toBeDefined();
    expect(validateFamilyMember({ ...VALID, age: '121' }).age).toBeDefined();
    expect(validateFamilyMember({ ...VALID, age: '0' }).age).toBeUndefined();
    expect(validateFamilyMember({ ...VALID, age: '120' }).age).toBeUndefined();
  });

  it('rejects a future birth date', () => {
    expect(
      validateFamilyMember({ ...VALID, birthDate: '2999-01-01' }).birthDate
    ).toBe('La fecha no puede ser futura');
  });

  it('reports a typed-but-impossible date differently from an empty one', () => {
    expect(
      validateFamilyMember({ ...VALID, birthDate: '', birthDateInvalid: true })
        .birthDate
    ).toBe('Escriba una fecha válida');
    expect(validateFamilyMember({ ...VALID, birthDate: '' }).birthDate).toBe(
      'La fecha de nacimiento es requerida'
    );
  });

  it('flags the same name and birth date as a duplicate, ignoring case, accents and spaces', () => {
    const errors = validateFamilyMember(
      { ...VALID, fullName: '  ANA   móra ' },
      [{ ...existing, fullName: 'ana mora' }]
    );
    expect(errors.fullName).toBe('Este familiar ya está registrado');
  });

  it('does not treat the same name with another birth date as a duplicate', () => {
    expect(
      validateFamilyMember({ ...VALID, birthDate: '2000-01-01' }, [existing])
    ).toEqual({});
  });

  // D-19 (abierto): la edad no se compara con la fecha de nacimiento.
  it('does not compare the age with the birth date', () => {
    expect(
      validateFamilyMember({ ...VALID, age: '5', birthDate: '1950-01-01' })
    ).toEqual({});
  });
});
