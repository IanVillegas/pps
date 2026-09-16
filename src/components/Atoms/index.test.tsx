import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonColor, Checkbox, InputText } from './index';

// sad-aml-shared esta excluido de Jest (testPathIgnorePatterns); las pruebas
// de lo que le agregamos/corregimos ahi viven aqui, importando el barril.

describe('Button color Cta', () => {
  it('applies a color class distinta de la de green por defecto', () => {
    const { container: ctaContainer } = render(
      <Button text="Ingresar" color={ButtonColor.Cta} />
    );
    const { container: defaultContainer } = render(<Button text="Ingresar" />);

    const ctaButton = ctaContainer.querySelector('button');
    const defaultButton = defaultContainer.querySelector('button');

    expect(ctaButton?.className).toContain('cta');
    expect(ctaButton?.className).not.toEqual(defaultButton?.className);
  });
});

describe('InputText: label y error asociados (fix DEC-002B)', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<InputText label="Cedula" />);
    expect(screen.getByLabelText('Cedula')).toBeInTheDocument();
  });

  it('links the error to the input via aria-describedby', () => {
    render(<InputText label="Cedula" errors="Cedula invalida" />);
    const input = screen.getByLabelText('Cedula');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const errorNode = document.getElementById(describedBy!.split(' ')[0]);
    expect(errorNode).toHaveTextContent('Cedula invalida');
  });

  it('still forwards native maxLength (la version vieja lo descartaba)', () => {
    render(<InputText label="Codigo" maxLength={5} />);
    expect(screen.getByLabelText('Codigo')).toHaveAttribute('maxlength', '5');
  });
});

describe('Checkbox (DEC-002C, movido a sad-aml-shared)', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<Checkbox label="Recordar usuario" />);
    expect(screen.getByLabelText('Recordar usuario')).toBeInTheDocument();
  });

  it('toggles with the keyboard (space) like a native checkbox', async () => {
    render(<Checkbox label="Recordar usuario" />);
    const checkbox = screen.getByLabelText('Recordar usuario');
    checkbox.focus();
    await userEvent.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('links the error to the input via aria-describedby', () => {
    render(<Checkbox label="Acepto" errors="Debe aceptar para continuar" />);
    const checkbox = screen.getByLabelText('Acepto');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');

    const describedBy = checkbox.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      'Debe aceptar para continuar'
    );
  });

  it('respects disabled natively', () => {
    render(<Checkbox label="Recordar usuario" disabled />);
    expect(screen.getByLabelText('Recordar usuario')).toBeDisabled();
  });
});
