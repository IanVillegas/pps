import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dropdown } from './index';

// Pruebas del Dropdown reexportado desde sad-aml-shared, importado por el
// barril. Corrige el bug de keys aleatorias (Math.random()) y la falta de
// nombre accesible / soporte de error (ver tasks/todo.md, DEC-002C2).

const options = [
  { value: 'soltero', element: 'Soltero(a)' },
  { value: 'casado', element: 'Casado(a)' },
];

describe('Dropdown', () => {
  it('associates the label with the trigger via htmlFor/id', () => {
    render(
      <Dropdown
        label="Estado civil"
        placeholder="Selecciona"
        options={options}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Estado civil')).toBeInTheDocument();
  });

  it('opens with the keyboard and selects an option', async () => {
    const onChange = jest.fn();
    render(
      <Dropdown
        label="Estado civil"
        placeholder="Selecciona"
        options={options}
        onChange={onChange}
      />
    );
    const trigger = screen.getByLabelText('Estado civil');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const option = await screen.findByRole('option', { name: 'Casado(a)' });
    await userEvent.click(option);
    expect(onChange).toHaveBeenCalledWith('casado');
  });

  it('shows the controlled value as selected text', () => {
    render(
      <Dropdown
        label="Estado civil"
        placeholder="Selecciona"
        options={options}
        value="casado"
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText('Casado(a)')).toBeInTheDocument();
  });

  it('links the error to the trigger via aria-describedby', () => {
    render(
      <Dropdown
        label="Estado civil"
        placeholder="Selecciona"
        options={options}
        onChange={jest.fn()}
        errors="Campo obligatorio"
      />
    );
    const trigger = screen.getByLabelText('Estado civil');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    const describedBy = trigger.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      'Campo obligatorio'
    );
  });

  it('respects disabled natively', () => {
    render(
      <Dropdown
        label="Estado civil"
        placeholder="Selecciona"
        options={options}
        onChange={jest.fn()}
        disabled
      />
    );
    expect(screen.getByLabelText('Estado civil')).toBeDisabled();
  });

  it('shows the empty-state item when the option list is empty', async () => {
    render(
      <Dropdown
        label="Oficina"
        placeholder="Selecciona"
        options={[]}
        labelNoRegister="Sin oficinas disponibles"
        onChange={jest.fn()}
      />
    );
    await userEvent.click(screen.getByLabelText('Oficina'));
    expect(
      await screen.findByText('Sin oficinas disponibles')
    ).toBeInTheDocument();
  });
});
