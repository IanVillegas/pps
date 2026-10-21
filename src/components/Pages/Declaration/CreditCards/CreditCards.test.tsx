import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreditCards from './CreditCards';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchCreditCardsTotals } from '@/services/CreditCardsTotalsService';
import type { StepValues } from '@/types/Declaration.types';
import type {
  CreditCardItem,
  CreditCardsTotals,
} from '@/types/CreditCard.types';

jest.mock('@/services/CreditCardsTotalsService');

const TOTALS: CreditCardsTotals = {
  colones: { balance: 1897.45, installments: 1000 },
  dolares: { balance: 2500, installments: 300 },
};

const COLONES_CARD: CreditCardItem = {
  id: 'a',
  period: 'Mensual',
  entity: 'grupo-mutual',
  currency: 'colones',
  expiryDate: '2028-05-20',
  limit: '2000000',
  lastFour: '1234',
  balanceColones: '350000',
  installmentColones: '25000',
  balanceDollars: '0',
  installmentDollars: '0',
};
const DOLLARS_CARD: CreditCardItem = {
  id: 'b',
  period: 'Anual',
  entity: 'banco-1',
  currency: 'dolares',
  expiryDate: '2029-01-05',
  limit: '5000',
  lastFour: '9876',
  balanceColones: '0',
  installmentColones: '0',
  balanceDollars: '1200',
  installmentDollars: '150',
};

const mockedFetch = jest.mocked(fetchCreditCardsTotals);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <CreditCards values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String((values.cards as CreditCardItem[] | undefined)?.length ?? 0)}
      </output>
    </NotificationProvider>
  );
};

const renderCards = (cards?: CreditCardItem[]) =>
  render(<Harness initial={cards ? { cards } : {}} />);

const pick = async (label: string, option: string) => {
  screen.getByLabelText(label).focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.click(await screen.findByRole('option', { name: option }));
};

const settle = () => screen.findByText('₡ 1,897.45');

describe('CreditCards (paso 9)', () => {
  beforeEach(() => mockedFetch.mockResolvedValue(TOTALS));

  it('shows an empty table (not an error) and lets the person add', async () => {
    renderCards();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
    await settle();
  });

  it('shows each card with formatted amounts, readable catalogs and date', async () => {
    renderCards([COLONES_CARD, DOLLARS_CARD]);
    const row = screen.getByRole('row', { name: /1234/ });
    expect(within(row).getByText('Mensual')).toBeInTheDocument();
    expect(within(row).getByText('Grupo Mutual')).toBeInTheDocument();
    expect(within(row).getByText('20/05/2028')).toBeInTheDocument();
    expect(within(row).getByText('2,000,000')).toBeInTheDocument();
    expect(within(row).getByText('Colones')).toBeInTheDocument();
    expect(within(row).getByText('350,000')).toBeInTheDocument();
    expect(within(row).getByText('25,000')).toBeInTheDocument();
    const second = screen.getByRole('row', { name: /9876/ });
    expect(within(second).getByText('Dólares')).toBeInTheDocument();
    expect(within(second).getByText('1,200')).toBeInTheDocument();
    expect(within(second).getByText('05/01/2029')).toBeInTheDocument();
    await settle();
  });

  it('shows balances and monthly installments per currency from the backend', async () => {
    renderCards([COLONES_CARD]);
    expect(await settle()).toBeInTheDocument();
    expect(screen.getByText('₡ 1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$ 2,500.00')).toBeInTheDocument();
    expect(screen.getByText('$ 300.00')).toBeInTheDocument();
    expect(
      screen.getByText('Saldo total de tarjetas en colones')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Saldo total de tarjetas en dólares')
    ).toBeInTheDocument();
  });

  it('shows a dash until the first answer arrives and warns when the backend fails', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));
    renderCards();
    expect(screen.getAllByText('—')).toHaveLength(4);
    expect(
      (await screen.findAllByText(TOAST_MESSAGES.requestFailed.message)).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('opens the empty modal with its ten fields', async () => {
    renderCards();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    [
      'Entidad financiera *',
      'Periodo *',
      'Moneda *',
      'Límite de tarjeta *',
      'Fecha de vencimiento *',
      'Últimos 4 # de operación *',
      'Saldo colones *',
      'Cuota colones *',
      'Saldo dólares *',
      'Cuota dólares *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
    await settle();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderCards();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    [
      'El periodo es requerido',
      'La entidad financiera es requerida',
      'La moneda es requerida',
      'La fecha de vencimiento es requerida',
      'El límite de la tarjeta es requerido',
      'Los últimos 4 dígitos de la operación son requeridos',
      'El saldo en colones es requerido',
      'La cuota en colones es requerida',
      'El saldo en dólares es requerido',
      'La cuota en dólares es requerida',
    ].forEach(message => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    await settle();
  });

  it('only accepts digits in the amounts and at most four in the operation number', async () => {
    renderCards();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const limit = screen.getByLabelText('Límite de tarjeta *');
    await userEvent.type(limit, '1a5b0');
    expect(limit).toHaveValue('150');
    const lastFour = screen.getByLabelText('Últimos 4 # de operación *');
    await userEvent.type(lastFour, '12a3456');
    expect(lastFour).toHaveValue('1234');
    await settle();
  });

  it('adds a card, confirms with a notification and asks the backend again', async () => {
    renderCards();
    await settle();
    const callsBefore = mockedFetch.mock.calls.length;
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await pick('Entidad financiera *', 'Grupo Mutual');
    await userEvent.type(screen.getByLabelText('Periodo *'), 'Mensual');
    await pick('Moneda *', 'Colones');
    await userEvent.type(
      screen.getByLabelText('Límite de tarjeta *'),
      '900000'
    );
    await userEvent.type(
      screen.getByLabelText('Fecha de vencimiento *'),
      '20/05/2040'
    );
    await userEvent.type(
      screen.getByLabelText('Últimos 4 # de operación *'),
      '4321'
    );
    await userEvent.type(screen.getByLabelText('Saldo colones *'), '120000');
    await userEvent.type(screen.getByLabelText('Cuota colones *'), '15000');
    await userEvent.type(screen.getByLabelText('Saldo dólares *'), '0');
    await userEvent.type(screen.getByLabelText('Cuota dólares *'), '0');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(await screen.findByText('120,000')).toBeInTheDocument();
    expect(screen.getByText('20/05/2040')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      (await screen.findAllByText(TOAST_MESSAGES.saved.message)).length
    ).toBeGreaterThan(0);
    await waitFor(() =>
      expect(mockedFetch.mock.calls.length).toBeGreaterThan(callsBefore)
    );
    expect(mockedFetch).toHaveBeenLastCalledWith([
      expect.objectContaining({
        balanceColones: '120000',
        installmentColones: '15000',
        balanceDollars: '0',
        installmentDollars: '0',
      }),
    ]);
  });

  it('cancelling leaves the table untouched', async () => {
    renderCards([COLONES_CARD]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar tarjeta 1234' })
    );
    const period = screen.getByLabelText('Periodo *');
    await userEvent.clear(period);
    await userEvent.type(period, 'Otro periodo');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Mensual')).toBeInTheDocument();
    expect(screen.queryByText('Otro periodo')).not.toBeInTheDocument();
    await settle();
  });

  it('edits a card prefilled with its data', async () => {
    renderCards([COLONES_CARD]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar tarjeta 1234' })
    );
    expect(screen.getByLabelText('Periodo *')).toHaveValue('Mensual');
    expect(screen.getByLabelText('Saldo colones *')).toHaveValue('350000');
    expect(screen.getByLabelText('Fecha de vencimiento *')).toHaveValue(
      '20/05/2028'
    );

    const balance = screen.getByLabelText('Saldo colones *');
    await userEvent.clear(balance);
    await userEvent.type(balance, '300000');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('300,000')).toBeInTheDocument();
    expect(screen.queryByText('350,000')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    await settle();
  });

  it('removes a card and confirms with a notification', async () => {
    renderCards([COLONES_CARD, DOLLARS_CARD]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar tarjeta 9876' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
    expect(screen.queryByText('9876')).not.toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
    await settle();
  });
});
