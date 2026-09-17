import { login } from './AuthService';

describe('adaptador de acceso simulado', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    ['error.demo', 'invalid_credentials'],
    ['conexion.demo', 'unavailable'],
  ])('expone el escenario %s', async (username, reason) => {
    const result = login({ username, password: 'sintetica' });
    await jest.advanceTimersByTimeAsync(600);
    await expect(result).resolves.toEqual({ success: false, reason });
  });

  it('entrega un vencimiento absoluto de cinco minutos', async () => {
    const result = login({ username: 'bloqueo.demo', password: 'sintetica' });
    await jest.advanceTimersByTimeAsync(600);
    await expect(result).resolves.toEqual({
      success: false,
      reason: 'locked',
      retryAt: Date.now() + 300000,
    });
  });
});
