'use client';

import { useEffect, useState } from 'react';
import { fetchSavingsTotals } from '@/services/SavingsTotalsService';
import type { SavingsAccountItem, SavingsTotals } from '@/types/Savings.types';

interface SavingsTotalsState {
  /** Ultima cifra recibida; se conserva mientras llega la siguiente o si falla. */
  totals: SavingsTotals | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend los saldos por moneda cada vez que cambian las cuentas
 * (D-11: cada alta/edicion/retiro ya se guardo, asi que el total oficial se
 * refresca en cada cambio). Descarta respuestas de pedidos viejos para que
 * una lenta no pise a una mas reciente. El arreglo debe ser estable entre
 * renders (viene del borrador): se compara por referencia.
 */
export const useSavingsTotals = (
  accounts: SavingsAccountItem[]
): SavingsTotalsState & { retry: () => void } => {
  const [state, setState] = useState<SavingsTotalsState>({
    totals: null,
    status: 'loading',
  });

  // Cada reintento vuelve a pedir la cifra aunque los registros no cambien.
  const [attempt, setAttempt] = useState(0);
  const retry = () => setAttempt(count => count + 1);

  useEffect(() => {
    let current = true;
    setState(previous =>
      previous.status === 'error'
        ? { ...previous, status: 'loading' }
        : previous
    );
    fetchSavingsTotals(accounts)
      .then(totals => {
        if (current) setState({ totals, status: 'ready' });
      })
      .catch(() => {
        if (current) setState(previous => ({ ...previous, status: 'error' }));
      });
    return () => {
      current = false;
    };
  }, [accounts, attempt]);

  return { ...state, retry };
};
