// DEC-014 Totales de créditos por moneda.
// ! [SIMULADO] Totales de creditos calculados en el navegador (provisional). Reemplazar por el adaptador real o borrar al conectar el backend

import type {
  CreditCurrencyTotals,
  CreditItem,
  CreditsTotals,
} from '@/types/Credit.types';

// SIMULACION de la respuesta del backend para los totales de creditos
// El backend es quien calcula la suma de saldos y
// la sumatoria de cuotas por moneda; el frontend solo los muestra, sin
// convertir ni sumar entre monedas. La suma de abajo es PROVISIONAL, solo para
// que la pantalla tenga algo que mostrar; cuando exista la API real,
// `fetchCreditsTotals` es lo unico que cambia
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
