import {
  amountToCents,
  centsToAmount,
  formatAmount,
  formatCents,
  MAX_AMOUNT_DIGITS,
} from './money';

describe('formatAmount', () => {
  it('keeps whole digit strings without decimals, as the other steps show them', () => {
    expect(formatAmount('1500000')).toBe('1,500,000');
  });

  it('shows amounts with cents always with two decimals', () => {
    expect(formatAmount('1234.56')).toBe('1,234.56');
    expect(formatAmount('1500000.00')).toBe('1,500,000.00');
    expect(formatAmount('0.05')).toBe('0.05');
  });

  it('returns text that is not an amount as it came', () => {
    expect(formatAmount('abc')).toBe('abc');
  });
});

describe('amountToCents', () => {
  it('reads amounts with cents', () => {
    expect(amountToCents('1234.56')).toBe(123456);
    expect(amountToCents('0.01')).toBe(1);
    expect(amountToCents('0.00')).toBe(0);
  });

  it('reads a legacy whole amount as whole currency units', () => {
    expect(amountToCents('1500000')).toBe(150000000);
  });

  it('pads a single decimal digit', () => {
    expect(amountToCents('12.5')).toBe(1250);
  });

  it('returns null for empty or non amount text', () => {
    expect(amountToCents('')).toBeNull();
    expect(amountToCents('abc')).toBeNull();
    expect(amountToCents('1.234')).toBeNull();
    expect(amountToCents('-5')).toBeNull();
  });
});

describe('centsToAmount and formatCents', () => {
  it('writes cents as a decimal text with two decimals', () => {
    expect(centsToAmount(1)).toBe('0.01');
    expect(centsToAmount(12345600)).toBe('123456.00');
    expect(centsToAmount(0)).toBe('0.00');
  });

  it('formats cents with thousands separators and two decimals', () => {
    expect(formatCents(1)).toBe('0.01');
    expect(formatCents(123)).toBe('1.23');
    expect(formatCents(123456)).toBe('1,234.56');
    expect(formatCents(12345600)).toBe('123,456.00');
  });

  it('keeps every digit of the largest amount that can be typed', () => {
    const max = Number('9'.repeat(MAX_AMOUNT_DIGITS));
    expect(formatCents(max)).toBe('9,999,999,999,999.99');
    expect(centsToAmount(max)).toBe('9999999999999.99');
    expect(amountToCents(centsToAmount(max))).toBe(max);
  });
});
