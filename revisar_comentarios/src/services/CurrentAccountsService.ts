// DEC-013 Cuentas de Grupo Mutual y saldos del paso 7.
// ! [SIMULADO] Cuentas de Grupo Mutual y saldos de ejemplo (provisional). Reemplazar por el adaptador real o borrar al conectar el backend

import type {
  CurrentAccountItem,
  CurrentAccountTotals,
  GroupCurrentAccount,
} from '@/types/CurrentAccount.types';

// SIMULACION de la respuesta del backend para el paso 7
const DELAY_MS = 250;

const MOCK_GROUP_ACCOUNTS: GroupCurrentAccount[] = [
  {
    id: 'gm-mock-1',
    accountNumber: '100-200-30000000',
    holderName: 'Ian Villegas Jiménez',
    relationship: 'Principal',
    balance: 250000,
    currency: 'colones',
    entity: 'grupo-mutual',
  },
];

const wait = () => new Promise(resolve => setTimeout(resolve, DELAY_MS));

export const fetchGroupCurrentAccounts = async (): Promise<
  GroupCurrentAccount[]
> => {
  await wait();
  return MOCK_GROUP_ACCOUNTS;
};

const sumByCurrency = (
  amounts: { balance: number; currency: string }[],
  currency: string
) =>
  amounts
    .filter(account => account.currency === currency)
    .reduce((total, account) => total + account.balance, 0);

/** Saldos por moneda: cuentas de Grupo Mutual mas las que agrego la persona */
export const fetchCurrentAccountTotals = async (
  added: Pick<CurrentAccountItem, 'balance' | 'currency'>[]
): Promise<CurrentAccountTotals> => {
  await wait();
  const all = [
    ...MOCK_GROUP_ACCOUNTS,
    ...added.map(account => ({
      balance: Number(account.balance || 0),
      currency: account.currency,
    })),
  ];
  return {
    colones: sumByCurrency(all, 'colones'),
    dolares: sumByCurrency(all, 'dolares'),
  };
};
