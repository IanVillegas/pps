'use client';

import { useEffect, useState } from 'react';
import { fetchCreditsTotals } from '@/services/CreditsTotalsService';
import type { CreditItem, CreditsTotals } from '@/types/Credit.types';

interface CreditsTotalsState {
  /** Ultimos totales recibidos; se conservan mientras llegan los siguientes o si falla. */
  totals: CreditsTotals | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend los totales por moneda cada vez que cambian los creditos
 * (D-11: cada alta/edicion/retiro ya se guardo, asi que el total oficial se
 * refresca en cada cambio). Descarta respuestas de pedidos viejos para que una
 * lenta no pise a una mas reciente. El arreglo debe ser estable entre renders
 * (viene del borrador): se compara por referencia.
 */
export const useCreditsTotals = (
  credits: CreditItem[]
): CreditsTotalsState & { retry: () => void } => {
  const [state, setState] = useState<CreditsTotalsState>({
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
    fetchCreditsTotals(credits)
      .then(totals => {
        if (current) setState({ totals, status: 'ready' });
      })
      .catch(() => {
        if (current) setState(previous => ({ ...previous, status: 'error' }));
      });
    return () => {
      current = false;
    };
  }, [credits, attempt]);

  return { ...state, retry };
};
