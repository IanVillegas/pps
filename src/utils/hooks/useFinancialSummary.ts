'use client';

import { useEffect, useState } from 'react';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type {
  ExpenseItem,
  FinancialSummary,
  IncomeItem,
} from '@/types/IncomeExpenses.types';

interface FinancialSummaryState {
  /** Ultima cifra recibida; se conserva mientras llega la siguiente o si falla. */
  summary: FinancialSummary | null;
  status: 'loading' | 'ready' | 'error';
}

/**
 * Pide al backend las cifras del paso 3 cada vez que cambian los ingresos
 * adicionales o los egresos (D-11: cada alta/edicion/retiro ya se guardo, asi
 * que el total oficial se refresca en cada cambio). Descarta respuestas de
 * pedidos viejos para que una lenta no pise a una mas reciente. Los arreglos
 * deben ser estables entre renders (vienen del borrador): se compara por
 * referencia.
 */
export const useFinancialSummary = (
  additionalIncomes: IncomeItem[],
  expenses: ExpenseItem[]
): FinancialSummaryState => {
  const [state, setState] = useState<FinancialSummaryState>({
    summary: null,
    status: 'loading',
  });

  useEffect(() => {
    let current = true;
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
  }, [additionalIncomes, expenses]);

  return state;
};
