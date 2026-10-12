import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncomeExpenses from './IncomeExpenses';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type { StepValues } from '@/types/Declaration.types';
import type {
  FinancialSummary,
  IncomeItem,
} from '@/types/IncomeExpenses.types';

jest.mock('@/services/FinancialSummaryService');

const SUMMARY: FinancialSummary = {
  grossSalary: 1500000,
  netSalary: 1200000,
  totalExpenses: 0,
  monthlyBalance: 1200000,
  expenseToIncomeRatio: 0,
  creditPaymentToIncomeRatio: 0,
};

const RENT: IncomeItem = {
  id: 'a',
  type: 'alquileres',
  amount: '350000',
  justification: 'Apartamento',
  attachments: ['contrato.pdf'],
};
const COMMISSION: IncomeItem = {
  id: 'b',
  type: 'comisiones',
  amount: '80000',
  justification: 'Ventas',
  attachments: [],
};

const mockedFetch = jest.mocked(fetchFinancialSummary);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <IncomeExpenses values={values} errors={{}} onChange={setValues} />
      <output data-testid="incomes">
        {String(
          (values.additionalIncomes as IncomeItem[] | undefined)?.length ?? 0
        )}
      </output>
    </NotificationProvider>
  );
};

const renderStep = (incomes?: IncomeItem[]) =>
  render(<Harness initial={incomes ? { additionalIncomes: incomes } : {}} />);

const pdf = (name: string) =>
  new File([new Uint8Array(1024)], name, { type: 'application/pdf' });

describe('IncomeExpenses (paso 3)', () => {
  beforeEach(() => mockedFetch.mockResolvedValue(SUMMARY));

  describe('planilla', () => {
    it('shows the payroll gross and net salary given by the backend', async () => {
      renderStep();
      const gross = await screen.findByRole('row', { name: /Salario bruto/ });
      expect(within(gross).getByText('1,500,000')).toBeInTheDocument();
      const net = screen.getByRole('row', { name: /Salario neto/ });
      expect(within(net).getByText('1,200,000')).toBeInTheDocument();
    });

    it('shows a loading text until the payroll arrives', async () => {
      renderStep();
      expect(
        screen.getByText('Cargando datos de planilla…')
      ).toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });

    it('keeps the page usable and warns when the backend fails', async () => {
      mockedFetch.mockRejectedValue(new Error('fail'));
      renderStep();
      expect(
        await screen.findByText('No se pudieron cargar los datos de planilla')
      ).toBeInTheDocument();
      expect(
        (await screen.findAllByText(TOAST_MESSAGES.requestFailed.message))
          .length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByRole('button', { name: 'Agregar nuevo' })[0]
      ).toBeInTheDocument();
    });
  });

  describe('ingresos adicionales', () => {
    it('shows an empty table (not an error) and lets the person add', async () => {
      renderStep();
      expect(
        screen.getAllByText('No existen registros')[0]
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole('button', { name: 'Agregar nuevo' })[0]
      ).toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });

    it('lists each income with its formatted amount and attachment count', async () => {
      renderStep([RENT, COMMISSION]);
      const row = screen.getByRole('row', { name: /Alquileres/ });
      expect(within(row).getByText('350,000')).toBeInTheDocument();
      expect(within(row).getByText('1 archivo(s)')).toBeInTheDocument();
      expect(screen.getByText('0 archivo(s)')).toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });

    it('asks every required field and adds nothing when submitting empty', async () => {
      renderStep();
      await userEvent.click(
        screen.getAllByRole('button', { name: 'Agregar nuevo' })[0]
      );
      expect(
        screen.getAllByText('Ingresos adicionales').length
      ).toBeGreaterThan(0);
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      expect(
        screen.getByText('El tipo de ingreso es requerido')
      ).toBeInTheDocument();
      expect(screen.getByText('El monto es requerido')).toBeInTheDocument();
      expect(
        screen.getByText('La justificación es requerida')
      ).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('0');
      await screen.findByText('Salario bruto');
    });

    it('does not let the person save while a file is still uploading', async () => {
      renderStep();
      await userEvent.click(
        screen.getAllByRole('button', { name: 'Agregar nuevo' })[0]
      );
      await userEvent.upload(
        screen.getByLabelText('Adjuntar documentos de respaldo'),
        pdf('contrato.pdf')
      );
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      expect(
        await screen.findByText('Espere a que terminen de subir los archivos')
      ).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('0');

      // Al terminar la subida simulada el aviso desaparece solo.
      await waitFor(
        () =>
          expect(
            screen.queryByText('Espere a que terminen de subir los archivos')
          ).not.toBeInTheDocument(),
        { timeout: 3000 }
      );
    });

    it('cancelling leaves the table untouched', async () => {
      renderStep([RENT]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar ingreso Alquileres' })
      );
      const amount = screen.getByLabelText('Monto *');
      await userEvent.clear(amount);
      await userEvent.type(amount, '1');
      await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

      expect(screen.getByText('350,000')).toBeInTheDocument();
      expect(
        screen.queryByText('1', { selector: 'td' })
      ).not.toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });

    it('edits an income prefilled with its data and its saved attachments', async () => {
      renderStep([RENT]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar ingreso Alquileres' })
      );
      expect(screen.getByLabelText('Monto *')).toHaveValue('350000');
      expect(screen.getByLabelText('Justificación *')).toHaveValue(
        'Apartamento'
      );
      expect(screen.getByText('contrato.pdf')).toBeInTheDocument();

      const amount = screen.getByLabelText('Monto *');
      await userEvent.clear(amount);
      await userEvent.type(amount, '400000');
      await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

      expect(await screen.findByText('400,000')).toBeInTheDocument();
      expect(screen.getByText('1 archivo(s)')).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('1');
    });

    it('removes an income and confirms with a notification', async () => {
      renderStep([RENT, COMMISSION]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Eliminar ingreso Comisiones' })
      );
      expect(screen.queryByText('80,000')).not.toBeInTheDocument();
      expect(screen.getByText('350,000')).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('1');
      expect(
        await screen.findByText('Eliminado satisfactoriamente')
      ).toBeInTheDocument();
    });
  });
});
