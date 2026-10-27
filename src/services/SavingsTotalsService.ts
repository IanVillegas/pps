// [SIMULADO] Totales de ahorro calculados en el navegador (provisional). Reemplazar por el adaptador real o borrar al conectar el backend: ver src/services/README.md.
import type { SavingsAccountItem, SavingsTotals } from '@/types/Savings.types';

// SIMULACION de la respuesta del backend para los saldos de ahorro (sin
// contrato todavia: D-08/D-10). El backend es quien calcula los saldos por
// moneda; el frontend solo los muestra, sin convertir ni sumar entre monedas.
// La suma de abajo es PROVISIONAL, solo para que la pantalla tenga algo que
// mostrar; al existir la API real, `fetchSavingsTotals` es lo unico que cambia
// (mismo contrato, otro adaptador), igual que FinancialSummaryService.
const DELAY_MS = 250;

const sumByCurrency = (
  accounts: Pick<SavingsAccountItem, 'amount' | 'currency'>[],
  currency: string
) =>
  accounts
    .filter(account => account.currency === currency)
    .reduce((total, account) => total + Number(account.amount || 0), 0);

export const fetchSavingsTotals = async (
  accounts: Pick<SavingsAccountItem, 'amount' | 'currency'>[]
): Promise<SavingsTotals> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  return {
    colones: sumByCurrency(accounts, 'colones'),
    dolares: sumByCurrency(accounts, 'dolares'),
  };
};
