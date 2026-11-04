import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Family from './Family';
import { NotificationProvider } from '@/components/Organisms/Notification/NotificationProvider';
import type { StepValues } from '@/types/Declaration.types';
import type { FamilyMember } from '@/types/Family.types';

const IAN: FamilyMember = {
  id: 'a',
  fullName: 'Ian Villegas',
  age: '28',
  relationship: 'hijo',
  gender: 'masculino',
  birthDate: '1998-05-20',
};
const EMMANUEL: FamilyMember = {
  id: 'b',
  fullName: 'Emmanuel Jimenez',
  age: '61',
  relationship: 'padre',
  gender: 'masculino',
  birthDate: '1965-03-02',
};

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
    renderFamily([IAN, EMMANUEL]);
    const row = screen.getByRole('row', { name: /Ian Villegas/ });
    expect(within(row).getByText('Hijo(a)')).toBeInTheDocument();
    expect(within(row).getByText('Masculino')).toBeInTheDocument();
    expect(within(row).getByText('20/05/1998')).toBeInTheDocument();
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
    // El modal sigue abierto
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
    renderFamily([IAN]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar Ian Villegas' })
    );
    const name = screen.getByLabelText('Nombre y apellidos *');
    await userEvent.clear(name);
    await userEvent.type(name, 'Otra persona');
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.getByText('Ian Villegas')).toBeInTheDocument();
    expect(screen.queryByText('Otra persona')).not.toBeInTheDocument();
  });

  it('edits a member prefilled with its data', async () => {
    renderFamily([IAN]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Editar Ian Villegas' })
    );
    expect(screen.getByLabelText('Nombre y apellidos *')).toHaveValue(
      'Ian Villegas'
    );
    expect(screen.getByLabelText('Edad en años cumplidos *')).toHaveValue('28');
    expect(screen.getByLabelText('Fecha de nacimiento *')).toHaveValue(
      '20/05/1998'
    );

    const name = screen.getByLabelText('Nombre y apellidos *');
    await userEvent.clear(name);
    await userEvent.type(name, 'Ian Emma Villegas');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(await screen.findByText('Ian Emma Villegas')).toBeInTheDocument();
    expect(screen.queryByText('Ian Villegas')).not.toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('rejects editing a member into a duplicate of another', async () => {
    renderFamily([
      IAN,
      { ...EMMANUEL, fullName: 'Ian Villegas', birthDate: '1998-05-20' },
    ]);
    await userEvent.click(
      screen.getAllByRole('button', { name: 'Editar Ian Villegas' })[1]
    );
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(
      screen.getByText('Este familiar ya está registrado')
    ).toBeInTheDocument();
  });

  it('removes a member and confirms with a notification', async () => {
    renderFamily([IAN, EMMANUEL]);
    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar Emmanuel Jimenez' })
    );
    await userEvent.click(screen.getByRole('button', { name: 'Sí, eliminar' }));
    expect(screen.queryByText('Emmanuel Jimenez')).not.toBeInTheDocument();
    expect(screen.getByText('Ian Villegas')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(
      await screen.findByText('Eliminado satisfactoriamente')
    ).toBeInTheDocument();
  });
});
