export const currencyFormat = (
  amount: number | string,
  idCurrent: number | string,
  space?: boolean
) => {
  const styleCurrency = idCurrent == 1 ? 'CRC' : 'USD';
  const simbol = idCurrent == 1 ? '₡' : '$';

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'standard',
    style: 'decimal',
    minimumFractionDigits: 2,
    currency: styleCurrency,
  });

  const amountFormat =
    simbol + (space ? ' ' : '') + formatter.format(Number(amount));

  return amountFormat;
};
