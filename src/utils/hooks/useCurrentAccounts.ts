'use client';

import { useEffect, useState } from 'react';
import {
  fetchCurrentAccountTotals,
  fetchGroupCurrentAccounts,
} from '@/services/CurrentAccountsService';
import type {
  CurrentAccountItem,
  CurrentAccountTotals,
  GroupCurrentAccount,
} from '@/types/CurrentAccount.types';

type Status = 'loading' | 'ready' | 'error';

interface CurrentAccountsState {
  /** Cuentas de Grupo Mutual (se piden una sola vez). */
  groupAccounts: GroupCurrentAccount[] | null;
  groupStatus: Status;
  /** Ultimos saldos recibidos; se conservan mientras llegan los siguientes o si falla. */
  totals: CurrentAccountTotals | null;
  totalsStatus: Status;
  /** Vuelve a pedir lo que fallo. */
  retry: () => void;
}

/**
 * Datos que entrega el backend para el paso 7: las cuentas de Grupo Mutual y
 * los saldos por moneda. Los saldos se vuelven a pedir cada vez que cambian las
 * cuentas agregadas (D-11: cada alta/edicion/retiro ya se guardo) y se
 * descartan las respuestas viejas. El arreglo debe ser estable entre renders
 * (viene del borrador): se compara por referencia.
 */
export const useCurrentAccounts = (
  added: CurrentAccountItem[]
): CurrentAccountsState => {
  const [group, setGroup] = useState<{
    accounts: GroupCurrentAccount[] | null;
    status: Status;
  }>({ accounts: null, status: 'loading' });
  const [totals, setTotals] = useState<{
    value: CurrentAccountTotals | null;
    status: Status;
  }>({ value: null, status: 'loading' });
  // Cada reintento vuelve a pedir las cuentas y los saldos.
  const [attempt, setAttempt] = useState(0);
  const retry = () => setAttempt(count => count + 1);

  useEffect(() => {
    let current = true;
    fetchGroupCurrentAccounts()
      .then(accounts => {
        if (current) setGroup({ accounts, status: 'ready' });
      })
      .catch(() => {
        if (current) setGroup({ accounts: null, status: 'error' });
      });
    return () => {
      current = false;
    };
  }, [attempt]);

  useEffect(() => {
    let current = true;
    fetchCurrentAccountTotals(added)
      .then(value => {
        if (current) setTotals({ value, status: 'ready' });
      })
      .catch(() => {
        if (current) setTotals(previous => ({ ...previous, status: 'error' }));
      });
    return () => {
      current = false;
    };
  }, [added, attempt]);

  return {
    groupAccounts: group.accounts,
    groupStatus: group.status,
    totals: totals.value,
    totalsStatus: totals.status,
    retry,
  };
};
