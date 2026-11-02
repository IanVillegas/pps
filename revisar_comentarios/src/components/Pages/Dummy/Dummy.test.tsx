import { render, screen } from '@testing-library/react';
import Dummy from './Dummy';

describe('HomePage', () => {
  const mockUsers = {
    fullName: `Prueba Servicio`,
    age: 20,
  };
  it('renders the button text', () => {
    render(<Dummy users={mockUsers} />);
    expect(screen.getByText('Títulos')).toBeInTheDocument();
  });
});
