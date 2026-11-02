'use client';

// DEC-014 Totales del paso 8.

import { useEffect, useState } from 'react';
import { fetchCreditsTotals } from '@/services/CreditsTotalsService';
import type { CreditItem, CreditsTotals } from '@/types/Credit.types';

interface CreditsTotalsState {
  /** Últimos totales recibidos; se conservan mientras llegan los siguientes o si falla */
  totals: CreditsTotals | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend los totales por moneda cada vez que cambian los créditos
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
