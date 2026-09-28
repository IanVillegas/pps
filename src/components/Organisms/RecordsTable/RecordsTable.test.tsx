import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecordsTable, { type RecordsTableColumn } from './RecordsTable';

interface Relative {
  id: string;
  name: string;
  age: number;
}

const columns: RecordsTableColumn<Relative>[] = [
  { key: 'name', header: 'Nombre', render: row => row.name },
  { key: 'age', header: 'Edad', render: row => row.age },
];

const rows: Relative[] = [
  { id: 'a', name: 'Ana Mora', age: 28 },
  { id: 'b', name: 'Luis Mora', age: 61 },
];

const setup = (props: Partial<Parameters<typeof RecordsTable<Relative>>[0]>) =>
  render(
    <RecordsTable
      caption="Núcleo familiar"
      columns={columns}
      rows={rows}
      getRowLabel={row => row.name}
      {...props}
    />
  );

describe('RecordsTable', () => {
  it('renders the headers and one row per record', () => {
    setup({});
    expect(
      screen.getByRole('columnheader', { name: 'Nombre' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Edad' })
    ).toBeInTheDocument();
    // 1 fila de encabezado + 2 registros.
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('Ana Mora')).toBeInTheDocument();
    expect(screen.getByText('61')).toBeInTheDocument();
  });

  it('exposes the table with an accessible name', () => {
    setup({});
    expect(
      screen.getByRole('table', { name: 'Núcleo familiar' })
    ).toBeInTheDocument();
  });

  it('shows the empty text (not an error) when there are no records', () => {
    setup({ rows: [], onAdd: jest.fn() });
    expect(screen.getByText('No existen registros')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    ).toBeInTheDocument();
  });

  it('accepts a custom empty text and add label', () => {
    setup({
      rows: [],
      onAdd: jest.fn(),
      emptyText: 'Sin familiares',
      addLabel: 'Agregar familiar',
    });
    expect(screen.getByText('Sin familiares')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar familiar' })
    ).toBeInTheDocument();
  });

  it('calls onAdd from the add button', async () => {
    const onAdd = jest.fn();
    setup({ onAdd });
    await userEvent.click(
      screen.getByRole('button', { name: 'Agregar nuevo' })
    );
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('names each row action after its record and passes that row', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    setup({ onEdit, onDelete });

    await userEvent.click(
      screen.getByRole('button', { name: 'Editar Luis Mora' })
    );
    expect(onEdit).toHaveBeenCalledWith(rows[1]);

    await userEvent.click(
      screen.getByRole('button', { name: 'Eliminar Ana Mora' })
    );
    expect(onDelete).toHaveBeenCalledWith(rows[0]);
  });

  it('omits the actions column and add button when no handlers are given', () => {
    setup({});
    expect(
      screen.queryByRole('columnheader', { name: 'Acciones' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Agregar nuevo' })
    ).not.toBeInTheDocument();
  });

  it('keeps each row tied to its record when a row is removed', () => {
    const { rerender } = setup({ onEdit: jest.fn() });
    const lastRow = () => screen.getAllByRole('row')[2];
    expect(within(lastRow()).getByText('Luis Mora')).toBeInTheDocument();

    rerender(
      <RecordsTable
        caption="Núcleo familiar"
        columns={columns}
        rows={[rows[1]]}
        getRowLabel={row => row.name}
        onEdit={jest.fn()}
      />
    );
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(
      screen.getByRole('button', { name: 'Editar Luis Mora' })
    ).toBeInTheDocument();
    expect(screen.queryByText('Ana Mora')).not.toBeInTheDocument();
  });

  it('makes the scroll region reachable by keyboard', () => {
    setup({});
    expect(
      screen.getByRole('region', { name: 'Núcleo familiar' })
    ).toHaveAttribute('tabindex', '0');
  });
});
