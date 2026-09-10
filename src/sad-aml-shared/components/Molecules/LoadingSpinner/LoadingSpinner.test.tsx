import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('react-i18next', () => ({
  useTranslation: () => [(value: string) => value],
}));

const renderLoadingSpinner = (props = {}) => {
  return render(<LoadingSpinner {...props} />);
};

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    const { getByText, container } = renderLoadingSpinner({
      text: 'loading...',
    });
    expect(getByText('loading...')).toBeTruthy();
    const spinner = container.querySelector('.spinner') as HTMLElement | null;
    expect(spinner).toBeTruthy();
    const circles = container.querySelectorAll('.spinner__circle');
    expect(circles.length).toBe(12);
  });

  it('renders with custom props', () => {
    const { getByText, container } = renderLoadingSpinner({
      size: '100px',
      text: 'Buscando...',
      textSize: '1em',
      textColor: '#ff0000',
      color: '#00ff00',
    });
    expect(getByText('Buscando...')).toBeTruthy();

    const text = container.querySelector('.text') as HTMLElement | null;
    expect(text).toBeTruthy();
  });

  it('renders correct number of spinner circles', () => {
    const { container } = renderLoadingSpinner();
    const circles = container.querySelectorAll('.spinner__circle');
    expect(circles.length).toBe(12);
  });
});
