import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovableAssets from './MovableAssets';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { MovableAssetItem } from '@/types/MovableAsset.types';

const CAR: MovableAssetItem = {
  id: 'a',
  type: 'vehiculo',
  brand: 'bmw',
  plate: 'IAN123',
  year: '2026',
  marketValue: '15000000',
  description: 'Sedán 4 puertas',
  observation: 'Sin gravámenes',
};
const BOAT: MovableAssetItem = {
  id: 'b',
  type: 'embarcacion',
  brand: 'otra',
  plate: 'B-001',
  year: '2019',
  marketValue: '3000000',
  description: 'Lancha',
  observation: 'Uso recreativo',
};

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <MovableAssets values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String((values.items as MovableAssetItem[] | undefined)?.length ?? 0)}
      </output>
    </NotificationProvider>
  );
};

const renderAssets = (items?: MovableAssetItem[]) =>
  render(<Harness initial={items ? { items } : {}} />);

describe('MovableAssets (paso 5)', () => {
  it('shows an empty table (not an error) and lets the person add', () => {
    renderAssets();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('shows each item with its formatted amount and readable catalogs', () => {
    renderAssets([CAR, BOAT]);
    const row = screen.getByRole('row', { name: /IAN123/ });
    expect(within(row).getByText('Vehículo')).toBeInTheDocument();
    expect(within(row).getByText('BMW')).toBeInTheDocument();
    expect(within(row).getByText('15,000,000')).toBeInTheDocument();
    expect(screen.getByText('Embarcación')).toBeInTheDocument();
    expect(screen.getByText('Otra')).toBeInTheDocument();
  });

  it('opens the empty modal from "Agregar nuevo" with its seven fields', async () => {
    renderAssets();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(screen.getByText('Datos del bien mueble')).toBeInTheDocument();
    [
      'Tipo de bien mueble *',
      'Marca del bien mueble *',
      'Descripción *',
      'Número de placa *',
      'Año *',
      'Valor de mercado *',
      'Observación *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderAssets();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(
      screen.getByText('El tipo de bien mueble es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('La marca es requerida')).toBeInTheDocument();
    expect(
      screen.getByText('El número de placa es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('El año es requerido')).toBeInTheDocument();
    expect(
      screen.getByText('El valor de mercado es requerido')
    ).toBeInTheDocument();
    expect(screen.getByText('La descripción es requerida')).toBeInTheDocument();
    expect(screen.getByText('La observación es requerida')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    // El modal sigue abierto.
    expect(screen.getByText('Datos del bien mueble')).toBeInTheDocument();
  });

  it('only accepts digits in the year and market value fields', async () => {
    renderAssets();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const year = screen.getByLabelText('Año *');
    await userEvent.type(year, '2a0b26');
    expect(year).toHaveValue('2026');
  });

  it('cancelling leaves the table untouched', async () => {
    renderAssets([CAR]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar placa IAN123' })
    );
    const plate = screen.getByLabelText('Número de placa *');
    await userEvent.clear(plate);
    await userEvent.type(plate, 'OTRA-1');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('IAN123')).toBeInTheDocument();
    expect(screen.queryByText('OTRA-1')).not.toBeInTheDocument();
  });

  it('edits an item prefilled with its data', async () => {
    renderAssets([CAR]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar placa IAN123' })
    );
    expect(screen.getByLabelText('Número de placa *')).toHaveValue('IAN123');
    expect(screen.getByLabelText('Año *')).toHaveValue('2026');

    const plate = screen.getByLabelText('Número de placa *');
    await userEvent.clear(plate);
    await userEvent.type(plate, 'NEW-99');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('NEW-99')).toBeInTheDocument();
    expect(screen.queryByText('IAN123')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('removes an item and confirms with a notification', async () => {
    renderAssets([CAR, BOAT]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar placa B-001' })
    );
    expect(screen.queryByText('B-001')).not.toBeInTheDocument();
    expect(screen.getByText('IAN123')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
