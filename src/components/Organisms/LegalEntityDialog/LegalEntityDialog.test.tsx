import { validateLegalEntity } from './LegalEntityDialog';

const VALID = {
  name: 'Inversiones Mora S.A.',
  legalId: '3-101-123456',
  purpose: 'Alquiler de locales comerciales',
  term: '99',
};

describe('validateLegalEntity', () => {
  it('requires the four fields', () => {
    const errors = validateLegalEntity({
      name: '',
      legalId: '',
      purpose: '',
      term: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'legalId',
      'name',
      'purpose',
      'term',
    ]);
  });

  it('accepts a complete legal entity', () => {
    expect(validateLegalEntity(VALID)).toEqual({});
  });

  it('treats text made only of spaces as empty', () => {
    const errors = validateLegalEntity({
      name: '   ',
      legalId: '  ',
      purpose: ' ',
      term: '   ',
    });
    expect(Object.keys(errors)).toHaveLength(4);
  });

  it('does not impose a format on the legal id', () => {
    expect(
      validateLegalEntity({
        ...VALID,
        legalId: 'ABC-77',
        term: '5',
      })
    ).toEqual({});
  });
});
