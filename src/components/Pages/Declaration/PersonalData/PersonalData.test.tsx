import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalData, { validatePersonalData } from './PersonalData';
import type { StepValues } from '@/types/Declaration.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';

const FILLED: StepValues = {
  fullName: 'Ana Pérez',
  idNumber: '1-2345-6789',
  age: '30',
  maritalStatus: 'soltero',
  lastAcademicDegree: 'Licenciatura',
  career: 'Administración',
  homePhone: '22223333',
  agency: 'agencia-1',
  cellPhone: '88889999',
  office: 'Oficina central',
  address: '100 metros norte de la iglesia, San José',
};

describe('validatePersonalData', () => {
  it('requires all eleven fields, including the address', () => {
    const errors = validatePersonalData({});
    expect(Object.keys(errors)).toHaveLength(11);
    expect(errors.address).toBe('La dirección es requerida');
  });

  it('is valid once the eleven required fields are filled', () => {
    expect(validatePersonalData(FILLED)).toEqual({});
  });

  it('treats a blank/whitespace value as missing', () => {
    const errors = validatePersonalData({ ...FILLED, fullName: '   ' });
    expect(errors.fullName).toBe('El nombre y los apellidos son requeridos');
  });
});

describe('PersonalData', () => {
  it('renders the eleven fields with their exact Figma labels', () => {
    render(<PersonalData values={{}} errors={{}} onChange={jest.fn()} />);
    [
      'Nombre y apellidos *',
      'Estado civil *',
      'Cédula *',
      'Último grado académico obtenido *',
      'Edad en años cumplidos *',
      'Carrera *',
      'Teléfono habitación *',
      'Agencia *',
      'Teléfono celular *',
      'Oficina para la que labora *',
      'Dirección actual (exacta) *',
    ].forEach(label => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });

  it('only "Estado civil" and "Agencia" are selects; the rest are free text', () => {
    render(<PersonalData values={{}} errors={{}} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Estado civil *')).toHaveAttribute(
      'role',
      'combobox'
    );
    expect(screen.getByLabelText('Agencia *')).toHaveAttribute(
      'role',
      'combobox'
    );
    expect(
      screen.getByLabelText('Último grado académico obtenido *')
    ).toHaveAttribute('type', 'text');
    expect(
      screen.getByLabelText('Oficina para la que labora *')
    ).toHaveAttribute('type', 'text');
  });

  it('reports the field values back through onChange without losing the rest', async () => {
    const onChange = jest.fn();
    render(
      <PersonalData
        values={{ idNumber: '1-1111-1111' }}
        errors={{}}
        onChange={onChange}
      />
    );
    await userEvent.type(screen.getByLabelText('Nombre y apellidos *'), 'A');
    expect(onChange).toHaveBeenLastCalledWith({
      idNumber: '1-1111-1111',
      fullName: 'A',
    });
  });

  it('caps every free-text field at a symbolic maxLength, ready to swap for a real one', () => {
    render(<PersonalData values={{}} errors={{}} onChange={jest.fn()} />);
    expect(screen.getByLabelText('Nombre y apellidos *')).toHaveAttribute(
      'maxlength',
      String(FIELD_MAX_LENGTH.personName)
    );
    expect(screen.getByLabelText('Cédula *')).toHaveAttribute(
      'maxlength',
      String(FIELD_MAX_LENGTH.idNumber)
    );
    expect(screen.getByLabelText('Edad en años cumplidos *')).toHaveAttribute(
      'maxlength',
      String(FIELD_MAX_LENGTH.age)
    );
    expect(screen.getByLabelText('Teléfono habitación *')).toHaveAttribute(
      'maxlength',
      String(FIELD_MAX_LENGTH.phone)
    );
    expect(
      screen.getByLabelText('Dirección actual (exacta) *')
    ).toHaveAttribute('maxlength', String(FIELD_MAX_LENGTH.address));
  });

  it('shows the error under its own field via aria-describedby', () => {
    render(
      <PersonalData
        values={{}}
        errors={{ fullName: 'El nombre y los apellidos son requeridos' }}
        onChange={jest.fn()}
      />
    );
    const field = screen.getByLabelText('Nombre y apellidos *');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(
      screen.getByText('El nombre y los apellidos son requeridos')
    ).toBeInTheDocument();
  });
});
