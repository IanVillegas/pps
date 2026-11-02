// DEC-015 Totales de tarjetas por moneda.
// ! [SIMULADO] Totales de tarjetas calculados en el navegador (provisional). Reemplazar por el adaptador real o borrar al conectar el backend

import type {
  CreditCardItem,
  CreditCardsTotals,
} from '@/types/CreditCard.types';

// SIMULACION de la respuesta del backend para los totales de tarjetas.
// El backend es quien calcula la suma de saldos
// y la sumatoria de cuotas por moneda; el frontend solo los muestra, sin
// convertir ni sumar entre monedas. La suma de abajo es PROVISIONAL, solo para
// que la pantalla tenga algo que mostrar; cuando exista la API real,
// `fetchCreditCardsTotals` es lo único que cambia
const DELAY_MS = 250;

type CardAmounts = Pick<
  CreditCardItem,
  | 'balanceColones'
  | 'installmentColones'
  | 'balanceDollars'
  | 'installmentDollars'
>;

const sum = (cards: CardAmounts[], field: keyof CardAmounts) =>
  cards.reduce((total, card) => total + Number(card[field] || 0), 0);

export const fetchCreditCardsTotals = async (
  cards: CardAmounts[]
): Promise<CreditCardsTotals> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  return {
    colones: {
      balance: sum(cards, 'balanceColones'),
      installments: sum(cards, 'installmentColones'),
    },
    dolares: {
      balance: sum(cards, 'balanceDollars'),
      installments: sum(cards, 'installmentDollars'),
    },
  };
};
