import { render } from '@testing-library/react';
import { Button, ButtonColor } from './index';

// No se prueba todo el Boton de sad-aml-shared (esta excluido de Jest); solo
// que ColorEnum.Cta, agregado para el CTA amarillo de Figma, efectivamente
// aplica una clase de color en vez de quedarse en el verde por defecto.
describe('Atoms barrel: Button color Cta', () => {
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
