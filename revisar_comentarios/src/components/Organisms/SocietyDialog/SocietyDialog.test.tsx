import { validateSociety } from './SocietyDialog';

const VALID = {
  name: 'Sociedad A',
  legalId: '2-132-7678HT',
  societyType: 'sociedad-anonima',
  role: 'Presidente',
  term: '90',
  sharePercent: '45',
  dietAmount: '5000.00',
  powerType: 'Poderoso',
  sumLimit: '900.00',
};

describe('validateSociety', () => {
  it('requires the nine fields', () => {
    const errors = validateSociety({
      name: '',
      legalId: '',
      societyType: '',
      role: '',
      term: '',
      sharePercent: '',
      dietAmount: '',
      powerType: '',
      sumLimit: '',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'dietAmount',
      'legalId',
      'name',
      'powerType',
      'role',
      'sharePercent',
      'societyType',
      'sumLimit',
      'term',
    ]);
  });

  it('accepts a complete society', () => {
    expect(validateSociety(VALID)).toEqual({});
  });

  it('treats text made only of spaces as empty', () => {
    const errors = validateSociety({
      ...VALID,
      name: '   ',
      legalId: ' ',
      role: '  ',
      term: ' ',
      sharePercent: ' ',
      powerType: '   ',
    });
    expect(Object.keys(errors).sort()).toEqual([
      'legalId',
      'name',
      'powerType',
      'role',
      'sharePercent',
      'term',
    ]);
  });

  it('accepts 0.00 as an amount and imposes no range on the percentage', () => {
    expect(
      validateSociety({
        ...VALID,
        dietAmount: '0.00',
        sumLimit: '0.00',
        sharePercent: '250',
      })
    ).toEqual({});
  });
});
