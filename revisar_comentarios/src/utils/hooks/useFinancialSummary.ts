'use client';

// DEC-009A Resumen financiero del paso 3.

import { useEffect, useState } from 'react';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type {
  ExpenseItem,
  FinancialSummary,
  IncomeItem,
} from '@/types/IncomeExpenses.types';

interface FinancialSummaryState {
  /** Última cifra recibida; se conserva mientras llega la siguiente o si falla */
  summary: FinancialSummary | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend las cifras del paso 3 cada vez que cambian los ingresos
 * adicionales o los egresos. Descarta respuestas de
 * pedidos viejos para que una lenta no pise a una mas reciente
 */
export const useFinancialSummary = (
  additionalIncomes: IncomeItem[],
  expenses: ExpenseItem[]
): FinancialSummaryState & { retry: () => void } => {
  const [state, setState] = useState<FinancialSummaryState>({
    summary: null,
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
    fetchFinancialSummary({ additionalIncomes, expenses })
      .then(summary => {
        if (current) setState({ summary, status: 'ready' });
      })
      .catch(() => {
        if (current) setState(previous => ({ ...previous, status: 'error' }));
      });
    return () => {
      current = false;
    };
  }, [additionalIncomes, expenses, attempt]);

  return { ...state, retry };
};
