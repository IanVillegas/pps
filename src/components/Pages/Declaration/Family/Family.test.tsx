import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Family from './Family';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { FamilyMember } from '@/types/Family.types';

const ANA: FamilyMember = {
  id: 'a',
  fullName: 'Ana Mora',
  age: '28',
  relationship: 'hijo',
  gender: 'femenino',
  birthDate: '1998-12-15',
};
const LUIS: FamilyMember = {
  id: 'b',
  fullName: 'Luis Mora',
  age: '61',
  relationship: 'padre',
  gender: 'masculino',
  birthDate: '1965-03-02',
};

// El paso guarda sus valores en el borrador del wizard; aqui un estado local
// hace el mismo papel para ver el resultado de cada accion.
const Harness = ({ initial }: { initial: StepValues }) => {
  const [values, setValues] = useState<StepValues>(initial);
  return (
    <NotificationProvider>
      <Family values={values} errors={{}} onChange={setValues} />
      <output data-testid="count">
        {String((values.members as FamilyMember[] | undefined)?.length ?? 0)}
      </output>
    </NotificationProvider>
  );
};

const renderFamily = (members?: FamilyMember[]) =>
  render(<Harness initial={members ? { members } : {}} />);

describe('Family (paso 2)', () => {
  it('shows an empty table (not an error) and lets the person add', () => {
    renderFamily();
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('shows each member with readable catalog labels and a DD/MM/YYYY date', () => {
    renderFamily([ANA, LUIS]);
    const row = screen.getByRole('row', { name: /Ana Mora/ });
    expect(within(row).getByText('Hijo(a)')).toBeInTheDocument();
    expect(within(row).getByText('Femenino')).toBeInTheDocument();
    expect(within(row).getByText('15/12/1998')).toBeInTheDocument();
    expect(screen.getByText('Padre')).toBeInTheDocument();
  });

  it('opens the empty modal from "Agregar nuevo" with its five fields', async () => {
    renderFamily();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(screen.getByText('Miembro del núcleo familiar')).toBeInTheDocument();
    [
      'Nombre y apellidos *',
      'Edad en años cumplidos *',
      'Parentesco *',
      'Género *',
      'Fecha de nacimiento *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument();
  });

  it('shows an error per empty field and adds nothing when submitting empty', async () => {
    renderFamily();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Agregar' }));

    expect(
      screen.getByText('El nombre y los apellidos son requeridos')
    ).toBeInTheDocument();
    expect(screen.getByText('La edad es requerida')).toBeInTheDocument();
    expect(screen.getByText('El parentesco es requerido')).toBeInTheDocument();
    expect(screen.getByText('El género es requerido')).toBeInTheDocument();
    expect(
      screen.getByText('La fecha de nacimiento es requerida')
    ).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    // El modal sigue abierto.
    expect(screen.getByText('Miembro del núcleo familiar')).toBeInTheDocument();
  });

  it('only accepts digits in the age field', async () => {
    renderFamily();
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    const age = screen.getByLabelText('Edad en años cumplidos *');
    await userEvent.type(age, '2a8');
    expect(age).toHaveValue('28');
  });

  it('cancelling leaves the table untouched', async () => {
    renderFamily([ANA]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar Ana Mora' })
    );
    const name = screen.getByLabelText('Nombre y apellidos *');
    await userEvent.clear(name);
    await userEvent.type(name, 'Otra persona');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Ana Mora')).toBeInTheDocument();
    expect(screen.queryByText('Otra persona')).not.toBeInTheDocument();
  });

  it('edits a member prefilled with its data', async () => {
    renderFamily([ANA]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar Ana Mora' })
    );
    expect(screen.getByLabelText('Nombre y apellidos *')).toHaveValue(
      'Ana Mora'
    );
    expect(screen.getByLabelText('Edad en años cumplidos *')).toHaveValue('28');
    expect(screen.getByLabelText('Fecha de nacimiento *')).toHaveValue(
      '15/12/1998'
    );

    const name = screen.getByLabelText('Nombre y apellidos *');
    await userEvent.clear(name);
    await userEvent.type(name, 'Ana María Mora');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Ana María Mora')).toBeInTheDocument();
    expect(screen.queryByText('Ana Mora')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('rejects editing a member into a duplicate of another', async () => {
    renderFamily([
      ANA,
      { ...LUIS, fullName: 'Ana Mora', birthDate: '1998-12-15' },
    ]);
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Editar Ana Mora' })[1]
    );
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(
      screen.getByText('Este familiar ya está registrado')
    ).toBeInTheDocument();
  });

  it('removes a member and confirms with a notification', async () => {
    renderFamily([ANA, LUIS]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar Luis Mora' })
    );
    expect(screen.queryByText('Luis Mora')).not.toBeInTheDocument();
    expect(screen.getByText('Ana Mora')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
