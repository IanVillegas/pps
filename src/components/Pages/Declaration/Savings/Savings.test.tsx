import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Savings from './Savings';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchSavingsTotals } from '@/services/SavingsTotalsService';
import type { StepValues } from '@/types/Declaration.types';
import type { SavingsAccountItem, SavingsTotals } from '@/types/Savings.types';

jest.mock('@/services/SavingsTotalsService');

const TOTALS: SavingsTotals = { colones: 1897.45, dolares: 1000 };

const COLONES: SavingsAccountItem = {
  id: 'a',
  accountNumber: '000111222',
  holderName: 'Ana Mora',
  relationship: 'titular',
  amount: '1500000',
  currency: 'colones',
  entity: 'grupo-mutual',
};
const DOLARES: SavingsAccountItem = {
  id: 'b',
  accountNumber: '000333444',
  holderName: 'Luis Mora',
  relationship: 'hijo',
  amount: '2500',
  currency: 'dolares',
  entity: 'banco-1',
};

const mockedFetch = jest.mocked(fetchSavingsTotals);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <Savings values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String(
          (values.accounts as SavingsAccountItem[] | undefined)?.length ?? 0
        )}
      </output>
    </NotificationProvider>
  );
};

const renderSavings = (accounts?: SavingsAccountItem[]) =>
  render(<Harness initial={accounts ? { accounts } : {}} />);

const pick = async (label: string, option: string) => {
  screen.getByLabelText(label).focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.click(await screen.findByRole('option', { name: option }));
};

describe('Savings (paso 6)', () => {
  beforeEach(() => mockedFetch.mockResolvedValue(TOTALS));

  it('shows an empty table (not an error) and lets the person add', async () => {
    renderSavings();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
    await screen.findByText('₡ 1,897.45');
  });

  it('shows each account with its formatted amount and readable catalogs', async () => {
    renderSavings([COLONES, DOLARES]);
    const row = screen.getByRole('row', { name: /000111222/ });
    expect(within(row).getByText('Ana Mora')).toBeInTheDocument();
    expect(within(row).getByText('Titular')).toBeInTheDocument();
    expect(within(row).getByText('1,500,000')).toBeInTheDocument();
    expect(within(row).getByText('Colones')).toBeInTheDocument();
    expect(within(row).getByText('Grupo Mutual')).toBeInTheDocument();
    const second = screen.getByRole('row', { name: /000333444/ });
    expect(within(second).getByText('Hijo(a)')).toBeInTheDocument();
    expect(within(second).getByText('Dólares')).toBeInTheDocument();
    await screen.findByText('₡ 1,897.45');
  });

  it('shows the balance per currency given by the backend', async () => {
    renderSavings([COLONES]);
    expect(await screen.findByText('₡ 1,897.45')).toBeInTheDocument();
    expect(screen.getByText('$ 1,000.00')).toBeInTheDocument();
  });

  it('shows a dash until the first answer arrives and warns when the backend fails', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));
    renderSavings();
    expect(screen.getAllByText('—')).toHaveLength(2);
    expect(
      (await screen.findAllByText(TOAST_MESSAGES.requestFailed.message)).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('opens the empty modal with its six fields', async () => {
    renderSavings();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(screen.getByText('Datos económicos')).toBeInTheDocument();
    [
      'Número de cuenta *',
      'Nombre del titular *',
      'Monto *',
      'Relación con la cuenta *',
      'Moneda *',
      'Entidad financiera *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
    await screen.findByText('₡ 1,897.45');
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderSavings();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(
      screen.getByText('El número de cuenta es requerido')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El nombre del titular es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('El monto es requerido')).toBeInTheDocument();
    expect(
      screen.getByText('La relación con la cuenta es requerida')
    ).toBeInTheDocument();
    expect(screen.getByText('La moneda es requerida')).toBeInTheDocument();
    expect(
      screen.getByText('La entidad financiera es requerida')
    ).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByText('Datos económicos')).toBeInTheDocument();
    await screen.findByText('₡ 1,897.45');
  });

  it('only accepts digits in the amount', async () => {
    renderSavings();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const amount = screen.getByLabelText('Monto *');
    await userEvent.type(amount, '1a5b0');
    expect(amount).toHaveValue('150');
    await screen.findByText('₡ 1,897.45');
  });

  it('adds an account, confirms with a notification and asks the backend again', async () => {
    renderSavings();
    await screen.findByText('₡ 1,897.45');
    const callsBefore = mockedFetch.mock.calls.length;
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.type(screen.getByLabelText('Número de cuenta *'), '987654');
    await userEvent.type(
      screen.getByLabelText('Nombre del titular *'),
      'Ana Mora'
    );
    await userEvent.type(screen.getByLabelText('Monto *'), '300000');
    await pick('Relación con la cuenta *', 'Titular');
    await pick('Moneda *', 'Colones');
    await pick('Entidad financiera *', 'Grupo Mutual');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(await screen.findByText('300,000')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      (await screen.findAllByText(TOAST_MESSAGES.saved.message)).length
    ).toBeGreaterThan(0);
    await waitFor(() =>
      expect(mockedFetch.mock.calls.length).toBeGreaterThan(callsBefore)
    );
    expect(mockedFetch).toHaveBeenLastCalledWith([
      expect.objectContaining({ amount: '300000', currency: 'colones' }),
    ]);
  });

  it('cancelling leaves the table untouched', async () => {
    renderSavings([COLONES]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar cuenta 000111222' })
    );
    const holder = screen.getByLabelText('Nombre del titular *');
    await userEvent.clear(holder);
    await userEvent.type(holder, 'Otra persona');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Ana Mora')).toBeInTheDocument();
    expect(screen.queryByText('Otra persona')).not.toBeInTheDocument();
    await screen.findByText('₡ 1,897.45');
  });

  it('edits an account prefilled with its data', async () => {
    renderSavings([COLONES]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar cuenta 000111222' })
    );
    expect(screen.getByLabelText('Número de cuenta *')).toHaveValue(
      '000111222'
    );
    expect(screen.getByLabelText('Monto *')).toHaveValue('1500000');

    const amount = screen.getByLabelText('Monto *');
    await userEvent.clear(amount);
    await userEvent.type(amount, '2000000');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('2,000,000')).toBeInTheDocument();
    expect(screen.queryByText('1,500,000')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes an account and confirms with a notification', async () => {
    renderSavings([COLONES, DOLARES]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar cuenta 000333444' })
    );
    expect(screen.queryByText('000333444')).not.toBeInTheDocument();
    expect(screen.getByText('000111222')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
