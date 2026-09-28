import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RealEstate from './RealEstate';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { RealEstateItem } from '@/types/RealEstate.types';

const HOUSE: RealEstateItem = {
  id: 'a',
  fincaNumber: '123456789',
  location: 'Guácima arriba',
  marketValue: '45000000',
  destination: 'vivienda',
  acquisitionForm: 'Compra',
};
const LOT: RealEstateItem = {
  id: 'b',
  fincaNumber: '987654321',
  location: 'San Rafael',
  marketValue: '12000000',
  destination: 'lote-sin-construir',
  acquisitionForm: 'Herencia',
};

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <RealEstate values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String(
          (values.properties as RealEstateItem[] | undefined)?.length ?? 0
        )}
      </output>
    </NotificationProvider>
  );
};

const renderRealEstate = (properties?: RealEstateItem[]) =>
  render(<Harness initial={properties ? { properties } : {}} />);

describe('RealEstate (paso 4)', () => {
  it('shows an empty table (not an error) and lets the person add', () => {
    renderRealEstate();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('shows each property with its formatted amount and readable destination', () => {
    renderRealEstate([HOUSE, LOT]);
    const row = screen.getByRole('row', { name: /123456789/ });
    expect(within(row).getByText('Guácima arriba')).toBeInTheDocument();
    expect(within(row).getByText('45,000,000')).toBeInTheDocument();
    expect(within(row).getByText('Vivienda')).toBeInTheDocument();
    expect(screen.getByText('Lote sin construir')).toBeInTheDocument();
  });

  it('opens the empty modal from "Agregar nuevo" with its five fields', async () => {
    renderRealEstate();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(screen.getByText('Datos del bien inmueble')).toBeInTheDocument();
    [
      'Número de finca *',
      'Ubicación *',
      'Valor de mercado *',
      'Destino *',
      'Forma de adquisición *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderRealEstate();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(
      screen.getByText('El número de finca es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('La ubicación es requerida')).toBeInTheDocument();
    expect(
      screen.getByText('El valor de mercado es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('El destino es requerido')).toBeInTheDocument();
    expect(
      screen.getByText('La forma de adquisición es requerida')
    ).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    // El modal sigue abierto.
    expect(screen.getByText('Datos del bien inmueble')).toBeInTheDocument();
  });

  it('only accepts digits in the market value field', async () => {
    renderRealEstate();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const value = screen.getByLabelText('Valor de mercado *');
    await userEvent.type(value, '4a5');
    expect(value).toHaveValue('45');
  });

  it('cancelling leaves the table untouched', async () => {
    renderRealEstate([HOUSE]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar finca 123456789' })
    );
    const location = screen.getByLabelText('Ubicación *');
    await userEvent.clear(location);
    await userEvent.type(location, 'Otro lugar');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Guácima arriba')).toBeInTheDocument();
    expect(screen.queryByText('Otro lugar')).not.toBeInTheDocument();
  });

  it('edits a property prefilled with its data', async () => {
    renderRealEstate([HOUSE]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar finca 123456789' })
    );
    expect(screen.getByLabelText('Número de finca *')).toHaveValue('123456789');
    expect(screen.getByLabelText('Valor de mercado *')).toHaveValue('45000000');

    const location = screen.getByLabelText('Ubicación *');
    await userEvent.clear(location);
    await userEvent.type(location, 'Heredia centro');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Heredia centro')).toBeInTheDocument();
    expect(screen.queryByText('Guácima arriba')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes a property and confirms with a notification', async () => {
    renderRealEstate([HOUSE, LOT]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar finca 987654321' })
    );
    expect(screen.queryByText('San Rafael')).not.toBeInTheDocument();
    expect(screen.getByText('Guácima arriba')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
