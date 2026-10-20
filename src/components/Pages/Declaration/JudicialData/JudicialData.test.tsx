import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JudicialData, { validateJudicialData } from './JudicialData';
import type { StepErrors, StepValues } from '@/types/Declaration.types';

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel y vuelve a validar tras cada cambio, como el wizard
// despues de un intento fallido de continuar.
const Harness = ({
  initial = {},
  validateOnChange = false,
}: {
  initial?: StepValues;
  validateOnChange?: boolean;
}) => {
  const [values, setValues] = useState<StepValues>(initial);
  const [errors, setErrors] = useState<StepErrors>(
    validateOnChange ? validateJudicialData(initial) : {}
  );
  return (
    <>
      <JudicialData
        values={values}
        errors={errors}
        onChange={next => {
          setValues(next);
          if (validateOnChange) setErrors(validateJudicialData(next));
        }}
      />
      <output data-testid="values">{JSON.stringify(values)}</output>
    </>
  );
};

const stored = () =>
  JSON.parse(screen.getByTestId('values').textContent ?? '{}') as StepValues;

const PENAL = '¿Ha estado implicado en juicios por la vía penal?';
const CIVIL = '¿Ha estado implicado en juicios por la vía civil?';
const EMBARGOES = '¿Posee usted embargos?';
const ALIMONY = '¿Paga pensión alimenticia?';

describe('validateJudicialData', () => {
  it('asks for nothing while the alimony question is off', () => {
    expect(validateJudicialData({})).toEqual({});
    expect(validateJudicialData({ penal: true, civil: true })).toEqual({});
  });

  it('requires to whom and how much once the alimony is on', () => {
    expect(validateJudicialData({ alimony: true })).toEqual({
      alimonyTo: 'Indique a quién paga la pensión alimenticia',
      alimonyAmount: 'El monto que cancela por mes es requerido',
    });
  });

  it('treats a name of only spaces as empty and rejects non digit amounts', () => {
    expect(
      validateJudicialData({
        alimony: true,
        alimonyTo: '   ',
        alimonyAmount: '12a',
      })
    ).toEqual({
      alimonyTo: 'Indique a quién paga la pensión alimenticia',
      alimonyAmount: 'Escriba solo números',
    });
  });

  it('accepts a complete alimony and never requires the optional details', () => {
    expect(
      validateJudicialData({
        penal: true,
        civil: true,
        embargoes: true,
        alimony: true,
        alimonyTo: 'María Mora',
        alimonyAmount: '150000',
      })
    ).toEqual({});
  });
});

describe('JudicialData (paso 11)', () => {
  it('starts with the four questions answered No and no extra fields', () => {
    render(<Harness />);
    [PENAL, CIVIL, EMBARGOES, ALIMONY].forEach(question => {
      expect(screen.getByRole('switch', { name: question })).toHaveAttribute(
        'aria-checked',
        'false'
      );
    });
    expect(screen.queryByLabelText('¿A quién? *')).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText('Detalle de los embargos')
    ).not.toBeInTheDocument();
  });

  it('shows the optional detail of a trial or embargo only while it is on', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('switch', { name: EMBARGOES }));
    const detail = screen.getByLabelText('Detalle de los embargos');
    await userEvent.type(detail, 'Embargo sobre vehículo');
    expect(stored()).toMatchObject({
      embargoes: true,
      embargoesDetail: 'Embargo sobre vehículo',
    });
  });

  it('shows the two alimony fields with their asterisks when it is on', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('switch', { name: ALIMONY }));
    expect(screen.getByLabelText('¿A quién? *')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Monto que cancela por mes *')
    ).toBeInTheDocument();
  });

  it('only accepts digits in the monthly amount', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('switch', { name: ALIMONY }));
    const amount = screen.getByLabelText('Monto que cancela por mes *');
    await userEvent.type(amount, '1a5b0');
    expect(amount).toHaveValue('150');
  });

  it('drops the detail from the draft when a question goes back to No', async () => {
    render(<Harness />);
    const civil = screen.getByRole('switch', { name: CIVIL });
    await userEvent.click(civil);
    await userEvent.type(
      screen.getByLabelText('Detalle de los juicios por la vía civil'),
      'Cobro'
    );
    await userEvent.click(civil);

    expect(stored()).toEqual({ civil: false });
    expect(
      screen.queryByLabelText('Detalle de los juicios por la vía civil')
    ).not.toBeInTheDocument();
  });

  it('starts clean when a question is turned on again after being turned off', async () => {
    render(<Harness />);
    const civil = screen.getByRole('switch', { name: CIVIL });
    await userEvent.click(civil);
    await userEvent.type(
      screen.getByLabelText('Detalle de los juicios por la vía civil'),
      'Cobro'
    );
    await userEvent.click(civil);
    await userEvent.click(civil);
    expect(
      screen.getByLabelText('Detalle de los juicios por la vía civil')
    ).toHaveValue('');
  });

  it('drops the alimony fields and their errors when it goes back to No', async () => {
    render(<Harness initial={{ alimony: true }} validateOnChange />);
    expect(
      screen.getByText('El monto que cancela por mes es requerido')
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch', { name: ALIMONY }));

    expect(
      screen.queryByText('El monto que cancela por mes es requerido')
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('¿A quién? *')).not.toBeInTheDocument();
    expect(stored()).toEqual({ alimony: false });
  });

  it('shows the alimony errors on the fields and clears them as they are fixed', async () => {
    render(<Harness initial={{ alimony: true }} validateOnChange />);
    expect(
      screen.getByText('Indique a quién paga la pensión alimenticia')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('¿A quién? *')).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    await userEvent.type(screen.getByLabelText('¿A quién? *'), 'María Mora');
    expect(
      screen.queryByText('Indique a quién paga la pensión alimenticia')
    ).not.toBeInTheDocument();
  });

  it('keeps the answers of other questions when one changes', async () => {
    render(<Harness initial={{ penal: true, penalDetail: 'Caso 1' }} />);
    await userEvent.click(screen.getByRole('switch', { name: EMBARGOES }));
    expect(stored()).toEqual({
      penal: true,
      penalDetail: 'Caso 1',
      embargoes: true,
    });
  });
});
