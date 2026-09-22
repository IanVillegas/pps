import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonColor, Checkbox, InputText, Textarea } from './index';

// Pruebas de los atomos reexportados desde sad-aml-shared, importados por el
// barril.

describe('Button color Cta', () => {
  it('applies a class different from the default green one', () => {
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

describe('InputText', () => {
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

  it('forwards the native maxLength attribute', () => {
    render(<InputText label="Codigo" maxLength={5} />);
    expect(screen.getByLabelText('Codigo')).toHaveAttribute('maxlength', '5');
  });
});

describe('Checkbox', () => {
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

describe('Textarea', () => {
  it('associates the label with the textarea via htmlFor/id', () => {
    render(<Textarea label="Dirección" />);
    expect(screen.getByLabelText('Dirección')).toBeInTheDocument();
  });

  it('links the error to the textarea via aria-describedby', () => {
    render(<Textarea label="Dirección" errors="Dirección invalida" />);
    const textarea = screen.getByLabelText('Dirección');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');

    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(
      'Dirección invalida'
    );
  });

  it('has no error association when none is given', () => {
    render(<Textarea label="Dirección" />);
    expect(screen.getByLabelText('Dirección')).not.toHaveAttribute(
      'aria-invalid'
    );
  });
});
