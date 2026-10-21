import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrentAccounts from './CurrentAccounts';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import {
  fetchCurrentAccountTotals,
  fetchGroupCurrentAccounts,
} from '@/services/CurrentAccountsService';
import type { StepValues } from '@/types/Declaration.types';
import type {
  CurrentAccountItem,
  CurrentAccountTotals,
  GroupCurrentAccount,
} from '@/types/CurrentAccount.types';

jest.mock('@/services/CurrentAccountsService');

const GROUP: GroupCurrentAccount = {
  id: 'g1',
  accountNumber: '000111222',
  holderName: 'Ana Mora',
  relationship: 'titular',
  balance: 250000,
  currency: 'colones',
  entity: 'grupo-mutual',
};
const TOTALS: CurrentAccountTotals = { colones: 1897.45, dolares: 1000 };

const BANCO: CurrentAccountItem = {
  id: 'a',
  entity: 'banco-1',
  balance: '500000',
  currency: 'colones',
};
const COOP: CurrentAccountItem = {
  id: 'b',
  entity: 'cooperativa',
  balance: '1200',
  currency: 'dolares',
};

const mockedGroup = jest.mocked(fetchGroupCurrentAccounts);
const mockedTotals = jest.mocked(fetchCurrentAccountTotals);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <CurrentAccounts values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String(
          (values.accounts as CurrentAccountItem[] | undefined)?.length ?? 0
        )}
      </output>
    </NotificationProvider>
  );
};

const renderStep = (accounts?: CurrentAccountItem[]) =>
  render(<Harness initial={accounts ? { accounts } : {}} />);

const pick = async (label: string, option: string) => {
  screen.getByLabelText(label).focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.click(await screen.findByRole('option', { name: option }));
};

describe('CurrentAccounts (paso 7)', () => {
  beforeEach(() => {
    mockedGroup.mockResolvedValue([GROUP]);
    mockedTotals.mockResolvedValue(TOTALS);
  });

  describe('cuentas de Grupo Mutual', () => {
    it('shows the preloaded accounts without any edit or remove action', async () => {
      renderStep();
      const row = await screen.findByRole('row', { name: /000111222/ });
      expect(within(row).getByText('Ana Mora')).toBeInTheDocument();
      expect(within(row).getByText('Titular')).toBeInTheDocument();
      expect(within(row).getByText('250,000')).toBeInTheDocument();
      expect(within(row).getByText('Colones')).toBeInTheDocument();
      expect(within(row).getByText('Grupo Mutual')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Editar cuenta 000111222/ })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /Eliminar cuenta 000111222/ })
      ).not.toBeInTheDocument();
    });

    it('says so when there are none and shows a loading text first', async () => {
      mockedGroup.mockResolvedValue([]);
      renderStep();
      expect(
        screen.getByText('Cargando cuentas de Grupo Mutual…')
      ).toBeInTheDocument();
      expect(
        await screen.findByText('No hay cuentas corrientes de Grupo Mutual')
      ).toBeInTheDocument();
    });

    it('warns and keeps the page usable when the backend fails', async () => {
      mockedGroup.mockRejectedValue(new Error('fail'));
      renderStep();
      expect(
        await screen.findByText(
          'No se pudieron cargar las cuentas de Grupo Mutual'
        )
      ).toBeInTheDocument();
      expect(
        (await screen.findAllByText(TOAST_MESSAGES.requestFailed.message))
          .length
      ).toBeGreaterThan(0);
      expect(
        screen.getByRole('button', { name: 'Agregar nuevo' })
      ).toBeInTheDocument();
    });
  });

  describe('montos a la fecha', () => {
    it('shows an empty table (not an error) and lets the person add', async () => {
      renderStep();
      expect(screen.getByText('No existen registros')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Agregar nuevo' })
      ).toBeInTheDocument();
      await screen.findByText('Ana Mora');
    });

    it('lists each account with its formatted balance and readable catalogs', async () => {
      renderStep([BANCO, COOP]);
      const row = screen.getByRole('row', { name: /Banco 1/ });
      expect(within(row).getByText('500,000')).toBeInTheDocument();
      expect(within(row).getByText('Colones')).toBeInTheDocument();
      const second = screen.getByRole('row', { name: /Cooperativa/ });
      expect(within(second).getByText('1,200')).toBeInTheDocument();
      expect(within(second).getByText('Dólares')).toBeInTheDocument();
      await screen.findByText('Ana Mora');
    });

    it('opens the modal with its three fields and shows an error per empty field', async () => {
      renderStep();
      await userEvent.click(
        screen.getByRole('button', { name: 'Agregar nuevo' })
      );
      expect(screen.getByText('Datos económicos')).toBeInTheDocument();
      ['Entidad financiera *', 'Saldo actual *', 'Moneda *'].forEach(label => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
      expect(
        screen.getByText('La entidad financiera es requerida')
      ).toBeInTheDocument();
      expect(
        screen.getByText('El saldo actual es requerido')
      ).toBeInTheDocument();
      expect(screen.getByText('La moneda es requerida')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('0');
      await screen.findByText('Ana Mora');
    });

    it('only accepts digits in the balance', async () => {
      renderStep();
      await userEvent.click(
        screen.getByRole('button', { name: 'Agregar nuevo' })
      );
      const balance = screen.getByLabelText('Saldo actual *');
      await userEvent.type(balance, '1a5b0');
      expect(balance).toHaveValue('150');
      await screen.findByText('Ana Mora');
    });

    it('adds an account, confirms with a notification and asks the backend for the totals again', async () => {
      renderStep();
      await screen.findByText('₡ 1,897.45');
      const callsBefore = mockedTotals.mock.calls.length;
      await userEvent.click(
        screen.getByRole('button', { name: 'Agregar nuevo' })
      );
      await pick('Entidad financiera *', 'Banco 1 (mock)');
      await userEvent.type(screen.getByLabelText('Saldo actual *'), '300000');
      await pick('Moneda *', 'Colones');
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      expect(await screen.findByText('300,000')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(
        (await screen.findAllByText(TOAST_MESSAGES.saved.message)).length
      ).toBeGreaterThan(0);
      await waitFor(() =>
        expect(mockedTotals.mock.calls.length).toBeGreaterThan(callsBefore)
      );
      expect(mockedTotals).toHaveBeenLastCalledWith([
        expect.objectContaining({ balance: '300000', currency: 'colones' }),
      ]);
    });

    it('cancelling leaves the table untouched', async () => {
      renderStep([BANCO]);
      await userEvent.click(
        screen.getByRole('button', { name: /Editar cuenta Banco 1/ })
      );
      const balance = screen.getByLabelText('Saldo actual *');
      await userEvent.clear(balance);
      await userEvent.type(balance, '1');
      await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

      expect(screen.getByText('500,000')).toBeInTheDocument();
      await screen.findByText('Ana Mora');
    });

    it('edits an account prefilled with its data', async () => {
      renderStep([BANCO]);
      await userEvent.click(
        screen.getByRole('button', { name: /Editar cuenta Banco 1/ })
      );
      expect(screen.getByLabelText('Saldo actual *')).toHaveValue('500000');

      const balance = screen.getByLabelText('Saldo actual *');
      await userEvent.clear(balance);
      await userEvent.type(balance, '800000');
      await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

      expect(await screen.findByText('800,000')).toBeInTheDocument();
      expect(screen.queryByText('500,000')).not.toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });

    it('removes an account and confirms with a notification', async () => {
      renderStep([BANCO, COOP]);
      await userEvent.click(
        screen.getByRole('button', { name: /Eliminar cuenta Cooperativa/ })
      );
      expect(screen.queryByText('1,200')).not.toBeInTheDocument();
      expect(screen.getByText('500,000')).toBeInTheDocument();
      expect(screen.getByTestId('count')).toHaveTextContent('1');
      expect(
        await screen.findByText('Eliminado satisfactoriamente')
      ).toBeInTheDocument();
    });
  });

  describe('saldos', () => {
    it('shows the balance per currency given by the backend', async () => {
      renderStep();
      expect(await screen.findByText('₡ 1,897.45')).toBeInTheDocument();
      expect(screen.getByText('$ 1,000.00')).toBeInTheDocument();
    });

    it('shows a dash until the first answer arrives', async () => {
      renderStep();
      expect(screen.getAllByText('—')).toHaveLength(2);
      await screen.findByText('₡ 1,897.45');
    });
  });
});
      await userEvent.click(
        screen.getByRole('button', { name: 'Sí, eliminar' })
      );
