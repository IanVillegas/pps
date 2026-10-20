import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LegalEntities from './LegalEntities';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { LegalEntityItem } from '@/types/LegalEntity.types';

const MORA: LegalEntityItem = {
  id: 'a',
  name: 'Inversiones Mora S.A.',
  legalId: '3-101-123456',
  purpose: 'Alquiler de locales',
  term: '99 años',
};
const SOL: LegalEntityItem = {
  id: 'b',
  name: 'Servicios del Sol',
  legalId: '3-102-654321',
  purpose: 'Consultoría',
  term: 'Indefinido',
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
    </NotificationProvider>
  );
};

const renderEntities = (legalEntities?: LegalEntityItem[]) =>
  render(<Harness initial={legalEntities ? { legalEntities } : {}} />);

describe('LegalEntities (paso 10)', () => {
  it('shows an empty table (not an error) with the add action', () => {
    renderEntities();
    expect(
      screen.getByText(
        'Si posee usted alguna personería jurídica, por favor especifique.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('shows each legal entity in the columns of the design', () => {
    renderEntities([MORA, SOL]);
    ['Nombre', 'Cédula jurídica', 'Objetivo', 'Plazo'].forEach(header => {
      expect(
        screen.getByRole('columnheader', { name: header })
      ).toBeInTheDocument();
    });
    const row = screen.getByRole('row', { name: /Inversiones Mora/ });
    expect(within(row).getByText('3-101-123456')).toBeInTheDocument();
    expect(within(row).getByText('Alquiler de locales')).toBeInTheDocument();
    expect(within(row).getByText('99 años')).toBeInTheDocument();
    expect(screen.getByText('Servicios del Sol')).toBeInTheDocument();
  });

  it('opens the empty modal with its four fields', async () => {
    renderEntities();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
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
      screen.getByRole('button', { name: 'Agregar nuevo' })
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
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.type(screen.getByLabelText('Nombre *'), '  Nueva S.A.  ');
    await userEvent.type(
      screen.getByLabelText('Cédula jurídica *'),
      '3-101-999999'
    );
    await userEvent.type(screen.getByLabelText('Objetivo *'), 'Comercio');
    await userEvent.type(screen.getByLabelText('Plazo *'), '50 años');
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
    expect(screen.getByLabelText('Plazo *')).toHaveValue('99 años');

    const term = screen.getByLabelText('Plazo *');
    await userEvent.clear(term);
    await userEvent.type(term, 'Indefinido');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Indefinido')).toBeInTheDocument();
    expect(screen.queryByText('99 años')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes a legal entity and confirms with a notification', async () => {
    renderEntities([MORA, SOL]);
    await userEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar personería Servicios del Sol',
      })
    );
    expect(screen.queryByText('Servicios del Sol')).not.toBeInTheDocument();
    expect(screen.getByText('Inversiones Mora S.A.')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
