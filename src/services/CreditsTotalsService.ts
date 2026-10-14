import type {
  CreditCurrencyTotals,
  CreditItem,
  CreditsTotals,
} from '@/types/Credit.types';

// SIMULACION de la respuesta del backend para los totales de creditos (sin
// contrato todavia: D-08/D-10). El backend es quien calcula la suma de saldos y
// la sumatoria de cuotas por moneda; el frontend solo los muestra, sin
// convertir ni sumar entre monedas. La suma de abajo es PROVISIONAL, solo para
// que la pantalla tenga algo que mostrar; al existir la API real,
// `fetchCreditsTotals` es lo unico que cambia (mismo contrato, otro
// adaptador), igual que SavingsTotalsService.
const DELAY_MS = 250;

type CreditAmounts = Pick<
  CreditItem,
  'currentBalance' | 'installment' | 'currency'
>;

const totalsFor = (
  credits: CreditAmounts[],
  currency: string
): CreditCurrencyTotals =>
  credits
    .filter(credit => credit.currency === currency)
    .reduce(
      (totals, credit) => ({
        balance: totals.balance + Number(credit.currentBalance || 0),
        installments: totals.installments + Number(credit.installment || 0),
      }),
      { balance: 0, installments: 0 }
    );

export const fetchCreditsTotals = async (
  credits: CreditAmounts[]
): Promise<CreditsTotals> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  return {
    colones: totalsFor(credits, 'colones'),
    dolares: totalsFor(credits, 'dolares'),
  };
};
