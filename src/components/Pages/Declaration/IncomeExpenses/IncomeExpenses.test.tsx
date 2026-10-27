import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncomeExpenses, { validateIncomeExpenses } from './IncomeExpenses';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { fetchFinancialSummary } from '@/services/FinancialSummaryService';
import type { StepValues } from '@/types/Declaration.types';
import type {
  ExpenseItem,
  FinancialSummary,
  IncomeExpensesValues,
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
const Harness = ({
  initial,
  errors = {},
}: {
  initial: StepValues;
  errors?: Record<string, string>;
}) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <IncomeExpenses values={values} errors={errors} onChange={setValues} />
      <output data-testid="draft">{JSON.stringify(values)}</output>
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

const GAS: ExpenseItem = { id: 'e1', type: 'transporte', amount: '90000' };
const LOAN: ExpenseItem = {
  id: 'e2',
  type: 'cuotas-creditos',
  amount: '150000',
};

const renderValues = (
  initial: StepValues,
  errors: Record<string, string> = {}
) => render(<Harness initial={initial} errors={errors} />);

const draft = () =>
  JSON.parse(
    screen.getByTestId('draft').textContent ?? '{}'
  ) as IncomeExpensesValues;

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
      // Un monto entero anterior se lee como unidades enteras con centavos.
      expect(screen.getByLabelText('Monto *')).toHaveValue('350,000.00');
      expect(screen.getByLabelText('Justificación *')).toHaveValue(
        'Apartamento'
      );
      expect(screen.getByText('contrato.pdf')).toBeInTheDocument();

      const amount = screen.getByLabelText('Monto *');
      await userEvent.clear(amount);
      await userEvent.type(amount, '40000000');
      await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

      expect(await screen.findByText('400,000.00')).toBeInTheDocument();
      expect(screen.getByText('1 archivo(s)')).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('1');
    });

    it('removes an income and confirms with a notification', async () => {
      renderStep([RENT, COMMISSION]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Eliminar ingreso Comisiones' })
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'Sí, eliminar' })
      );
      expect(screen.queryByText('80,000')).not.toBeInTheDocument();
      expect(screen.getByText('350,000')).toBeInTheDocument();
      expect(screen.getByTestId('incomes')).toHaveTextContent('1');
      expect(
        await screen.findByText('Eliminado satisfactoriamente')
      ).toBeInTheDocument();
    });
  });

  describe('egresos', () => {
    const openExpenseDialog = async () => {
      const [, addExpense] = screen.getAllByRole('button', {
        name: 'Agregar nuevo',
      });
      await userEvent.click(addExpense);
    };

    it('shows an empty table and lets the person add', async () => {
      renderValues({});
      expect(screen.getAllByText('No existen registros')).toHaveLength(2);
      expect(
        screen.getAllByRole('button', { name: 'Agregar nuevo' })
      ).toHaveLength(2);
      await screen.findByText('Salario bruto');
    });

    it('lists each expense and shows the total given by the backend', async () => {
      mockedFetch.mockResolvedValue({ ...SUMMARY, totalExpenses: 240000 });
      renderValues({ expenses: [GAS, LOAN] });
      const row = screen.getByRole('row', { name: /Transporte/ });
      expect(within(row).getByText('90,000')).toBeInTheDocument();
      expect(screen.getByText('Cuotas de créditos')).toBeInTheDocument();
      expect(await screen.findByText('240,000')).toBeInTheDocument();
      expect(screen.getByText('Total de egresos')).toBeInTheDocument();
    });

    it('opens the informative modal and adds nothing when submitting empty', async () => {
      renderValues({});
      await openExpenseDialog();
      expect(screen.getByText('Favor considerar:')).toBeInTheDocument();
      expect(screen.getByLabelText('Tipo de egreso *')).toBeInTheDocument();
      expect(screen.getByLabelText('Monto *')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));
      expect(
        screen.getByText('El tipo de egreso es requerido')
      ).toBeInTheDocument();
      expect(screen.getByText('El monto es requerido')).toBeInTheDocument();
      expect(draft().expenses).toBeUndefined();
      await screen.findByText('Salario bruto');
    });

    it('adds an expense and confirms with a notification', async () => {
      renderValues({});
      await openExpenseDialog();
      screen.getByLabelText('Tipo de egreso *').focus();
      await userEvent.keyboard('{Enter}');
      await userEvent.click(
        await screen.findByRole('option', { name: 'Vivienda' })
      );
      await userEvent.type(screen.getByLabelText('Monto *'), '20000000');
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      expect(await screen.findByText('200,000.00')).toBeInTheDocument();
      expect(draft().expenses).toHaveLength(1);
      expect(draft().expenses?.[0]).toMatchObject({
        type: 'vivienda',
        amount: '200000.00',
      });
      expect(
        (await screen.findAllByText(TOAST_MESSAGES.saved.message)).length
      ).toBeGreaterThan(0);
    });

    it('edits and removes an expense', async () => {
      renderValues({ expenses: [GAS, LOAN] });
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar egreso Transporte' })
      );
      expect(screen.getByLabelText('Monto *')).toHaveValue('90,000.00');
      const amount = screen.getByLabelText('Monto *');
      await userEvent.clear(amount);
      await userEvent.type(amount, '9500000');
      await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
      expect(await screen.findByText('95,000.00')).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole('button', {
          name: 'Eliminar egreso Cuotas de créditos',
        })
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'Sí, eliminar' })
      );
      expect(screen.queryByText('150,000')).not.toBeInTheDocument();
      expect(draft().expenses).toHaveLength(1);
    });
  });

  describe('otros detalles', () => {
    it('shows the balance and ratios given by the backend, formatted', async () => {
      mockedFetch.mockResolvedValue({
        ...SUMMARY,
        monthlyBalance: 1897.45,
        expenseToIncomeRatio: 12.5,
        creditPaymentToIncomeRatio: 4.17,
      });
      renderValues({});
      expect(await screen.findByText('₡ 1,897.45')).toBeInTheDocument();
      expect(screen.getByText('12.50 %')).toBeInTheDocument();
      expect(screen.getByText('4.17 %')).toBeInTheDocument();
    });

    it('asks the backend again when an expense is added', async () => {
      renderValues({});
      await screen.findByText('Salario bruto');
      const callsBefore = mockedFetch.mock.calls.length;
      const [, addExpense] = screen.getAllByRole('button', {
        name: 'Agregar nuevo',
      });
      await userEvent.click(addExpense);
      screen.getByLabelText('Tipo de egreso *').focus();
      await userEvent.keyboard('{Enter}');
      await userEvent.click(
        await screen.findByRole('option', { name: 'Vivienda' })
      );
      await userEvent.type(screen.getByLabelText('Monto *'), '5');
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      await waitFor(() =>
        expect(mockedFetch.mock.calls.length).toBeGreaterThan(callsBefore)
      );
      expect(mockedFetch).toHaveBeenLastCalledWith({
        additionalIncomes: [],
        expenses: [
          expect.objectContaining({ type: 'vivienda', amount: '0.05' }),
        ],
      });
    });

    it('stores both answers and the description in the draft', async () => {
      renderValues({});
      await userEvent.click(screen.getByRole('radio', { name: 'Si' }));
      await userEvent.click(screen.getByRole('radio', { name: 'Difícil' }));
      await userEvent.type(
        screen.getByLabelText(/Agregue una descripción detallada/),
        'Gastos médicos'
      );
      expect(draft()).toMatchObject({
        patrimonialChanges: 'si',
        financialSituation: 'dificil',
        situationDetail: 'Gastos médicos',
      });
      await screen.findByText('Salario bruto');
    });

    it('lays the questions out in the order of Figma: situation, description, then patrimonial changes', async () => {
      renderValues({});
      const order = [
        '¿Cómo califica su situación financiera?',
        'Agregue una descripción detallada',
        '¿Existen cambios en el periodo actual en su situación patrimonial?',
      ].map(text => screen.getByText(new RegExp(text.replace(/[?¿]/g, '\$&'))));
      order.slice(1).forEach((node, index) => {
        expect(
          order[index].compareDocumentPosition(node) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
      });
      await screen.findByText('Salario bruto');
    });

    it('starts on No without the detail and shows it only while the answer is Sí (D-27)', async () => {
      renderValues({});
      const detail = () =>
        screen.queryByLabelText(
          'Detalle los cambios en su situación patrimonial'
        );
      // Por defecto: «No» elegido y sin campo de detalle.
      expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
      expect(detail()).not.toBeInTheDocument();
      // La respuesta por defecto tambien queda en el borrador.
      expect(draft()).toMatchObject({ patrimonialChanges: 'no' });

      await userEvent.click(screen.getByRole('radio', { name: 'Si' }));
      expect(detail()).toBeInTheDocument();
      await userEvent.type(detail()!, 'Heredé una propiedad');
      expect(draft()).toMatchObject({
        patrimonialChanges: 'si',
        patrimonialChangesDetail: 'Heredé una propiedad',
      });

      await userEvent.click(screen.getByRole('radio', { name: 'No' }));
      expect(detail()).not.toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });

    it('drops the detail from the draft when the answer goes back to No, keeping the rest', async () => {
      renderValues({});
      await userEvent.click(screen.getByRole('radio', { name: 'Difícil' }));
      await userEvent.click(screen.getByRole('radio', { name: 'Si' }));
      await userEvent.type(
        screen.getByLabelText(
          'Detalle los cambios en su situación patrimonial'
        ),
        'Texto'
      );
      await userEvent.click(screen.getByRole('radio', { name: 'No' }));

      const stored = draft();
      expect(stored).toMatchObject({
        patrimonialChanges: 'no',
        financialSituation: 'dificil',
      });
      expect(stored).not.toHaveProperty('patrimonialChangesDetail');
      await screen.findByText('Salario bruto');
    });

    it('starts the detail empty when the answer is turned to Sí again', async () => {
      renderValues({});
      await userEvent.click(screen.getByRole('radio', { name: 'Si' }));
      await userEvent.type(
        screen.getByLabelText(
          'Detalle los cambios en su situación patrimonial'
        ),
        'Texto'
      );
      await userEvent.click(screen.getByRole('radio', { name: 'No' }));
      await userEvent.click(screen.getByRole('radio', { name: 'Si' }));
      expect(
        screen.getByLabelText('Detalle los cambios en su situación patrimonial')
      ).toHaveValue('');
      await screen.findByText('Salario bruto');
    });

    it('shows the error the wizard hands over for the financial situation', async () => {
      renderValues({}, { financialSituation: 'Seleccione una opción' });
      expect(screen.getByText('Seleccione una opción')).toBeInTheDocument();
      await screen.findByText('Salario bruto');
    });
  });
});

describe('validateIncomeExpenses', () => {
  it('only requires the financial situation: the changes question starts on No and the tables and description are optional (D-16, D-27)', () => {
    expect(Object.keys(validateIncomeExpenses({})).sort()).toEqual([
      'financialSituation',
    ]);
  });

  it('never requires the detail of the patrimonial changes, even when the answer is Sí', () => {
    expect(
      validateIncomeExpenses({
        patrimonialChanges: 'si',
        financialSituation: 'grave',
      })
    ).toEqual({});
  });

  it('accepts a step with both answers and empty tables', () => {
    expect(
      validateIncomeExpenses({
        patrimonialChanges: 'no',
        financialSituation: 'estable',
      })
    ).toEqual({});
  });
});
