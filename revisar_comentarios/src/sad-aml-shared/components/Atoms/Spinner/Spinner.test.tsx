import React from 'react';
import { render } from '@testing-library/react';
import Spinner from './Spinner';
import styles from '../Spinner.module.scss';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';
import { SizeEnum } from '@/sad-aml-shared/types/enum/Size.enum';

describe('Spinner component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Spinner />);
    expect(container).toBeTruthy();
  });

  it('applies default size and color classes', () => {
    const { container } = render(<Spinner />);
    const circlesContainer = container.firstChild;
    const circles = circlesContainer?.childNodes;

    expect(circles?.length).toBe(12);
  });

  it('applies custom size and color classes', () => {
    const { container } = render(
      <Spinner size={SizeEnum.Large} color={ColorEnum.Red} />
    );

    const element = container.firstChild as HTMLElement;

    expect(element.classList).toContain(styles[SizeEnum.Large]);
  });
});
