import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import IncomeExpenses from './IncomeExpenses';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type { StepValues } from '@/types/Declaration.types';
import type { FinancialSummary } from '@/types/IncomeExpenses.types';

jest.mock('@/services/FinancialSummaryService');

const SUMMARY: FinancialSummary = {
  grossSalary: 1500000,
  netSalary: 1200000,
  totalExpenses: 0,
  monthlyBalance: 1200000,
  expenseToIncomeRatio: 0,
  creditPaymentToIncomeRatio: 0,
};

const mockedFetch = jest.mocked(fetchFinancialSummary);

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <IncomeExpenses values={values} errors={{}} onChange={setValues} />
    </NotificationProvider>
  );
};

const renderStep = () => render(<Harness initial={{}} />);

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
    });
  });
});
