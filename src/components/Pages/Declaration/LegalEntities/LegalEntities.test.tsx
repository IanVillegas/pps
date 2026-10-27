import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LegalEntities from './LegalEntities';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { LegalEntityItem, SocietyItem } from '@/types/LegalEntity.types';

const MORA: LegalEntityItem = {
  id: 'a',
  name: 'Inversiones Mora S.A.',
  legalId: '3-101-123456',
  purpose: 'Alquiler de locales',
  term: '99',
};
const SOL: LegalEntityItem = {
  id: 'b',
  name: 'Servicios del Sol',
  legalId: '3-102-654321',
  purpose: 'Consultoría',
  term: '5',
};

const SOCIEDAD_A: SocietyItem = {
  id: 's1',
  name: 'Sociedad A',
  legalId: '2-132-7678HT',
  societyType: 'sociedad-anonima',
  role: 'Presidente',
  term: '90',
  sharePercent: '45',
  dietAmount: '5000.00',
  powerType: 'Poderoso',
  sumLimit: '900.00',
};
const SOCIEDAD_B: SocietyItem = {
  ...SOCIEDAD_A,
  id: 's2',
  name: 'Sociedad B',
  term: '12',
};

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <LegalEntities values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String(
          (values.legalEntities as LegalEntityItem[] | undefined)?.length ?? 0
        )}
      </output>
      <output data-testid="societies">
        {String((values.societies as SocietyItem[] | undefined)?.length ?? 0)}
      </output>
    </NotificationProvider>
  );
};

const renderEntities = (
  legalEntities?: LegalEntityItem[],
  societies?: SocietyItem[]
) =>
  render(
    <Harness
      initial={{
        ...(legalEntities ? { legalEntities } : {}),
        ...(societies ? { societies } : {}),
      }}
    />
  );

describe('LegalEntities (paso 10)', () => {
  it('shows an empty table (not an error) with the add action', () => {
    renderEntities();
    expect(
      screen.getByText(
        'Si posee usted alguna personería jurídica, por favor especifique.'
      )
    ).toBeInTheDocument();
    // Una tabla vacia por cada bloque (personerias y sociedades).
    expect(screen.getAllByText('No existen registros')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Agregar nueva personería jurídica' })
    ).toBeInTheDocument();
  });

  it('shows each legal entity in the columns of the design', () => {
    renderEntities([MORA, SOL]);
    const table = screen.getByRole('table', { name: 'Personerías jurídicas' });
    ['Nombre', 'Cédula jurídica', 'Objetivo', 'Plazo'].forEach(header => {
      expect(
        within(table).getByRole('columnheader', { name: header })
      ).toBeInTheDocument();
    });
    const row = screen.getByRole('row', { name: /Inversiones Mora/ });
    expect(within(row).getByText('3-101-123456')).toBeInTheDocument();
    expect(within(row).getByText('Alquiler de locales')).toBeInTheDocument();
    expect(within(row).getByText('99')).toBeInTheDocument();
    expect(screen.getByText('Servicios del Sol')).toBeInTheDocument();
  });

  it('opens the empty modal with its four fields', async () => {
    renderEntities();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nueva personería jurídica' })
    );
    expect(
      screen.getByText('Datos de la personería jurídica')
    ).toBeInTheDocument();
    ['Nombre *', 'Cédula jurídica *', 'Objetivo *', 'Plazo *'].forEach(
      label => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      }
    );
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderEntities();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nueva personería jurídica' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(
      screen.getByText('La cédula jurídica es requerida')
    ).toBeInTheDocument();
    expect(screen.getByText('El objetivo es requerido')).toBeInTheDocument();
    expect(screen.getByText('El plazo es requerido')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(
      screen.getByText('Datos de la personería jurídica')
    ).toBeInTheDocument();
  });

  it('adds a legal entity and confirms with a notification', async () => {
    renderEntities();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nueva personería jurídica' })
    );
    await userEvent.type(screen.getByLabelText('Nombre *'), '  Nueva S.A.  ');
    await userEvent.type(
      screen.getByLabelText('Cédula jurídica *'),
      '3-101-999999'
    );
    await userEvent.type(screen.getByLabelText('Objetivo *'), 'Comercio');
    await userEvent.type(screen.getByLabelText('Plazo *'), '5a0');
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(await screen.findByText('Nueva S.A.')).toBeInTheDocument();
    expect(screen.getByText('3-101-999999')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      (await screen.findAllByText('Guardado satisfactoriamente')).length
    ).toBeGreaterThan(0);
  });

  it('cancelling leaves the table untouched', async () => {
    renderEntities([MORA]);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Editar personería Inversiones Mora S.A.',
      })
    );
    const name = screen.getByLabelText('Nombre *');
    await userEvent.clear(name);
    await userEvent.type(name, 'Otro nombre');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Inversiones Mora S.A.')).toBeInTheDocument();
    expect(screen.queryByText('Otro nombre')).not.toBeInTheDocument();
  });

  it('edits a legal entity prefilled with its data', async () => {
    renderEntities([MORA]);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Editar personería Inversiones Mora S.A.',
      })
    );
    expect(screen.getByLabelText('Cédula jurídica *')).toHaveValue(
      '3-101-123456'
    );
    expect(screen.getByLabelText('Plazo *')).toHaveValue('99');

    const term = screen.getByLabelText('Plazo *');
    await userEvent.clear(term);
    await userEvent.type(term, '30');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('30')).toBeInTheDocument();
    expect(screen.queryByText('99')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes a legal entity and confirms with a notification', async () => {
    renderEntities([MORA, SOL]);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar personería Servicios del Sol',
      })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
    expect(screen.queryByText('Servicios del Sol')).not.toBeInTheDocument();
    expect(screen.getByText('Inversiones Mora S.A.')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });

  describe('sociedades (DEC-016B)', () => {
    const openSocietyModal = async () => {
      await userEvent.click(
        screen.getByRole('button', { name: 'Agregar nueva sociedad' })
      );
    };

    it('shows the society table with its title and add action', () => {
      renderEntities();
      expect(
        screen.getByText(
          'Si usted forma parte en alguna sociedad, por favor especifique.'
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Agregar nueva sociedad' })
      ).toBeInTheDocument();
    });

    it('shows each society in the columns of the design, in order', () => {
      renderEntities(undefined, [SOCIEDAD_A, SOCIEDAD_B]);
      const table = screen.getByRole('table', { name: 'Sociedades' });
      const headers = within(table)
        .getAllByRole('columnheader')
        .map(header => header.textContent);
      expect(headers).toEqual([
        'Nombre',
        'Tipo de sociedad',
        'Cargo',
        'Plazo',
        'Porcentaje de acciones',
        'Monto de dieta',
        'Tipo de poder',
        'Límite suma',
        'Acciones',
      ]);
      const row = within(table).getByRole('row', { name: /Sociedad A/ });
      expect(within(row).getByText('Sociedad anónima')).toBeInTheDocument();
      expect(within(row).getByText('Presidente')).toBeInTheDocument();
      expect(within(row).getByText('90')).toBeInTheDocument();
      expect(within(row).getByText('45')).toBeInTheDocument();
      expect(within(row).getByText('5,000.00')).toBeInTheDocument();
      expect(within(row).getByText('Poderoso')).toBeInTheDocument();
      expect(within(row).getByText('900.00')).toBeInTheDocument();
      expect(screen.getByText('Sociedad B')).toBeInTheDocument();
    });

    it('opens the empty modal with its nine fields', async () => {
      renderEntities();
      await openSocietyModal();
      expect(screen.getByText('Datos de la sociedad')).toBeInTheDocument();
      [
        'Nombre de la sociedad *',
        'Cédula jurídica *',
        'Cargo en la sociedad *',
        'Plazo *',
        /porcentaje de acciones o participación/,
        /monto que percibe de dietas/,
        /el tipo de poder/,
        /el límite de suma/,
      ].forEach(label => {
        expect(screen.getByLabelText(label)).toBeInTheDocument();
      });
      expect(
        screen.getByRole('combobox', { name: /Tipo de sociedad/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Agregar' })
      ).toBeInTheDocument();
    });

    it('requires every field and adds nothing when submitting empty', async () => {
      renderEntities();
      await openSocietyModal();
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      [
        'El nombre es requerido',
        'La cédula jurídica es requerida',
        'El tipo de sociedad es requerido',
        'El cargo es requerido',
        'El plazo es requerido',
        'El porcentaje de acciones es requerido',
        'El monto de dietas es requerido',
        'El tipo de poder es requerido',
        'El límite de suma es requerido',
      ].forEach(message => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
      expect(screen.getByTestId('societies')).toHaveTextContent('0');
      expect(screen.getByText('Datos de la sociedad')).toBeInTheDocument();
    });

    it('adds a society with formatted amounts and confirms with a notification', async () => {
      renderEntities();
      await openSocietyModal();
      await userEvent.type(
        screen.getByLabelText('Nombre de la sociedad *'),
        '  Sociedad Nueva  '
      );
      await userEvent.type(
        screen.getByLabelText('Cédula jurídica *'),
        '3-101-555555'
      );
      await userEvent.click(
        screen.getByRole('combobox', { name: /Tipo de sociedad/ })
      );
      await userEvent.click(
        await screen.findByRole('option', {
          name: 'Sociedad de responsabilidad limitada',
        })
      );
      await userEvent.type(
        screen.getByLabelText('Cargo en la sociedad *'),
        'Tesorero'
      );
      await userEvent.type(screen.getByLabelText('Plazo *'), '9x9');
      await userEvent.type(
        screen.getByLabelText(/porcentaje de acciones o participación/),
        '12.5.5'
      );
      await userEvent.type(
        screen.getByLabelText(/monto que percibe de dietas/),
        '500000'
      );
      await userEvent.type(
        screen.getByLabelText(/el tipo de poder/),
        'Generalísimo'
      );
      await userEvent.type(screen.getByLabelText(/el límite de suma/), '90000');
      await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

      const row = await screen.findByRole('row', { name: /Sociedad Nueva/ });
      expect(
        within(row).getByText('Sociedad de responsabilidad limitada')
      ).toBeInTheDocument();
      expect(within(row).getByText('99')).toBeInTheDocument();
      expect(within(row).getByText('12.55')).toBeInTheDocument();
      expect(within(row).getByText('5,000.00')).toBeInTheDocument();
      expect(within(row).getByText('900.00')).toBeInTheDocument();
      expect(screen.getByTestId('societies')).toHaveTextContent('1');
      expect(screen.getByTestId('count')).toHaveTextContent('0');
      expect(
        (await screen.findAllByText('Guardado satisfactoriamente')).length
      ).toBeGreaterThan(0);
    });

    it('edits a society prefilled with its data', async () => {
      renderEntities(undefined, [SOCIEDAD_A]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar sociedad Sociedad A' })
      );
      expect(screen.getByLabelText('Cargo en la sociedad *')).toHaveValue(
        'Presidente'
      );
      expect(screen.getByLabelText(/monto que percibe de dietas/)).toHaveValue(
        '5,000.00'
      );

      const role = screen.getByLabelText('Cargo en la sociedad *');
      await userEvent.clear(role);
      await userEvent.type(role, 'Secretario');
      await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

      expect(await screen.findByText('Secretario')).toBeInTheDocument();
      expect(screen.queryByText('Presidente')).not.toBeInTheDocument();
      expect(screen.getByTestId('societies')).toHaveTextContent('1');
    });

    it('cancelling leaves the table untouched', async () => {
      renderEntities(undefined, [SOCIEDAD_A]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Editar sociedad Sociedad A' })
      );
      const name = screen.getByLabelText('Nombre de la sociedad *');
      await userEvent.clear(name);
      await userEvent.type(name, 'Otro nombre');
      await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

      expect(screen.getByText('Sociedad A')).toBeInTheDocument();
      expect(screen.queryByText('Otro nombre')).not.toBeInTheDocument();
    });

    it('removes a society after confirming and keeps the legal entities', async () => {
      renderEntities([MORA], [SOCIEDAD_A, SOCIEDAD_B]);
      await userEvent.click(
        screen.getByRole('button', { name: 'Eliminar sociedad Sociedad B' })
      );
      await userEvent.click(
        screen.getByRole('button', { name: 'Sí, eliminar' })
      );
      expect(screen.queryByText('Sociedad B')).not.toBeInTheDocument();
      expect(screen.getByText('Sociedad A')).toBeInTheDocument();
      expect(screen.getByText('Inversiones Mora S.A.')).toBeInTheDocument();
      expect(screen.getByTestId('societies')).toHaveTextContent('1');
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });
});
