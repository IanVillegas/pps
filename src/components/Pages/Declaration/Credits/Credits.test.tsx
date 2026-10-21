import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Credits from './Credits';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchCreditsTotals } from '@/services/CreditsTotalsService';
import type { StepValues } from '@/types/Declaration.types';
import type { CreditItem, CreditsTotals } from '@/types/Credit.types';

jest.mock('@/services/CreditsTotalsService');

const TOTALS: CreditsTotals = {
  colones: { balance: 1897.45, installments: 1000 },
  dolares: { balance: 2500, installments: 300 },
};

const PERSONAL: CreditItem = {
  id: 'a',
  entity: 'grupo-mutual',
  loanType: 'Personal',
  initialAmount: '5000000',
  currentBalance: '3200000',
  installment: '150000',
  loanNumber: 'OP-0001',
  currency: 'colones',
  endDate: '2027-05-20',
};
const CAR: CreditItem = {
  id: 'b',
  entity: 'banco-1',
  loanType: 'Vehículo',
  initialAmount: '20000',
  currentBalance: '12000',
  installment: '400',
  loanNumber: 'OP-0002',
  currency: 'dolares',
  endDate: '2029-01-05',
};

const mockedFetch = jest.mocked(fetchCreditsTotals);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <Credits values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String((values.credits as CreditItem[] | undefined)?.length ?? 0)}
      </output>
    </NotificationProvider>
  );
};

const renderCredits = (credits?: CreditItem[]) =>
  render(<Harness initial={credits ? { credits } : {}} />);

const pick = async (label: string, option: string) => {
  screen.getByLabelText(label).focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.click(await screen.findByRole('option', { name: option }));
};

const settle = () => screen.findByText('₡ 1,897.45');

describe('Credits (paso 8)', () => {
  beforeEach(() => mockedFetch.mockResolvedValue(TOTALS));

  it('shows an empty table (not an error) and lets the person add', async () => {
    renderCredits();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
    await settle();
  });

  it('shows each credit with formatted amounts, readable catalogs and date', async () => {
    renderCredits([PERSONAL, CAR]);
    const row = screen.getByRole('row', { name: /OP-0001/ });
    expect(within(row).getByText('Grupo Mutual')).toBeInTheDocument();
    expect(within(row).getByText('5,000,000')).toBeInTheDocument();
    expect(within(row).getByText('Colones')).toBeInTheDocument();
    expect(within(row).getByText('Personal')).toBeInTheDocument();
    expect(within(row).getByText('3,200,000')).toBeInTheDocument();
    expect(within(row).getByText('150,000')).toBeInTheDocument();
    expect(within(row).getByText('20/05/2027')).toBeInTheDocument();
    const second = screen.getByRole('row', { name: /OP-0002/ });
    expect(within(second).getByText('Dólares')).toBeInTheDocument();
    expect(within(second).getByText('05/01/2029')).toBeInTheDocument();
    await settle();
  });

  it('shows balances and monthly installments per currency from the backend', async () => {
    renderCredits([PERSONAL]);
    expect(await settle()).toBeInTheDocument();
    expect(screen.getByText('₡ 1,000.00')).toBeInTheDocument();
    expect(screen.getByText('$ 2,500.00')).toBeInTheDocument();
    expect(screen.getByText('$ 300.00')).toBeInTheDocument();
    expect(
      screen.getByText('Saldo total de créditos en colones')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Saldo total de créditos en dólares')
    ).toBeInTheDocument();
  });

  it('shows a dash until the first answer arrives and warns when the backend fails', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));
    renderCredits();
    expect(screen.getAllByText('—')).toHaveLength(4);
    expect(
      (await screen.findAllByText(TOAST_MESSAGES.requestFailed.message)).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('opens the empty modal with its eight fields', async () => {
    renderCredits();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(screen.getByText('Créditos')).toBeInTheDocument();
    [
      'Entidad financiera *',
      'Tipo de préstamo *',
      'Monto inicial *',
      'Saldo actual *',
      'Monto cuota *',
      'Número de préstamo *',
      'Moneda *',
      'Fecha de conclusión *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
    await settle();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderCredits();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(
      screen.getByText('La entidad financiera es requerida')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El tipo de préstamo es requerido')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El monto inicial es requerido')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El saldo actual es requerido')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El monto de la cuota es requerido')
    ).toBeInTheDocument();
    expect(
      screen.getByText('El número de préstamo es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('La moneda es requerida')).toBeInTheDocument();
    expect(
      screen.getByText('La fecha de conclusión es requerida')
    ).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByText('Créditos')).toBeInTheDocument();
    await settle();
  });

  it('formats the three amounts as they are typed and puts the currency above them', async () => {
    renderCredits();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const currency = screen.getByLabelText('Moneda *');
    for (const label of [
      'Monto inicial *',
      'Saldo actual *',
      'Monto cuota *',
    ]) {
      const amount = screen.getByLabelText(label);
      expect(amount).toHaveAttribute('placeholder', '0,000.00');
      expect(
        currency.compareDocumentPosition(amount) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
      expect(amount.parentElement?.querySelector('svg')).toBeFalsy();
    }
    const amount = screen.getByLabelText('Monto inicial *');
    await userEvent.type(amount, '1a5b0');
    expect(amount).toHaveValue('1.50');

    await pick('Moneda *', 'Dólares');
    for (const label of [
      'Monto inicial *',
      'Saldo actual *',
      'Monto cuota *',
    ]) {
      expect(
        screen.getByLabelText(label).parentElement?.querySelector('svg')
      ).toBeInTheDocument();
    }
    await settle();
  });

  it('adds a credit, confirms with a notification and asks the backend again', async () => {
    renderCredits();
    await settle();
    const callsBefore = mockedFetch.mock.calls.length;
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await pick('Entidad financiera *', 'Grupo Mutual');
    await userEvent.type(
      screen.getByLabelText('Tipo de préstamo *'),
      'Hipoteca'
    );
    await userEvent.type(screen.getByLabelText('Monto inicial *'), '900000000');
    await userEvent.type(screen.getByLabelText('Saldo actual *'), '800000000');
    await userEvent.type(screen.getByLabelText('Monto cuota *'), '12000000');
    await userEvent.type(
      screen.getByLabelText('Número de préstamo *'),
      'OP-0099'
    );
    await pick('Moneda *', 'Colones');
    await userEvent.type(
      screen.getByLabelText('Fecha de conclusión *'),
      '20/05/2040'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(await screen.findByText('8,000,000.00')).toBeInTheDocument();
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
        currentBalance: '8000000.00',
        installment: '120000.00',
        currency: 'colones',
      }),
    ]);
  });

  it('cancelling leaves the table untouched', async () => {
    renderCredits([PERSONAL]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar crédito OP-0001' })
    );
    const type = screen.getByLabelText('Tipo de préstamo *');
    await userEvent.clear(type);
    await userEvent.type(type, 'Otro tipo');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Personal')).toBeInTheDocument();
    expect(screen.queryByText('Otro tipo')).not.toBeInTheDocument();
    await settle();
  });

  it('edits a credit prefilled with its data', async () => {
    renderCredits([PERSONAL]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar crédito OP-0001' })
    );
    expect(screen.getByLabelText('Tipo de préstamo *')).toHaveValue('Personal');
    // Un monto entero anterior se lee como unidades enteras con centavos.
    expect(screen.getByLabelText('Saldo actual *')).toHaveValue('3,200,000.00');
    expect(screen.getByLabelText('Fecha de conclusión *')).toHaveValue(
      '20/05/2027'
    );

    const balance = screen.getByLabelText('Saldo actual *');
    await userEvent.clear(balance);
    await userEvent.type(balance, '300000000');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('3,000,000.00')).toBeInTheDocument();
    expect(screen.queryByText('3,200,000')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    await settle();
  });

  it('removes a credit and confirms with a notification', async () => {
    renderCredits([PERSONAL, CAR]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar crédito OP-0002' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
    expect(screen.queryByText('OP-0002')).not.toBeInTheDocument();
    expect(screen.getByText('OP-0001')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
    await settle();
  });
});
