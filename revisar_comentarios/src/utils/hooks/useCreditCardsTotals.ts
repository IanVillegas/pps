'use client';

// DEC-015 Totales del paso 9.

import { useEffect, useState } from 'react';
import { fetchCreditCardsTotals } from '@/services/CreditCardsTotalsService';
import type {
  CreditCardItem,
  CreditCardsTotals,
} from '@/types/CreditCard.types';

interface CreditCardsTotalsState {
  /** Ultimos totales recibidos; se conservan mientras llegan los siguientes o si falla */
  totals: CreditCardsTotals | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend los totales por moneda cada vez que cambian las tarjetas
 * (cada agregación/edición/retiro ya se guardo, asi que el total oficial se
 * refresca en cada cambio)
 */
export const useCreditCardsTotals = (
  cards: CreditCardItem[]
): CreditCardsTotalsState & { retry: () => void } => {
  const [state, setState] = useState<CreditCardsTotalsState>({
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
    fetchCreditCardsTotals(cards)
      .then(totals => {
        if (current) setState({ totals, status: 'ready' });
      })
      .catch(() => {
        if (current) setState(previous => ({ ...previous, status: 'error' }));
      });
    return () => {
      current = false;
    };
  }, [cards, attempt]);

  return { ...state, retry };
};
