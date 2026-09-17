// Adaptador simulado (DEC-004), sin backend ni contrato de API (D-08).
// error.demo, bloqueo.demo y conexion.demo permiten verificar los estados.
// Los demas usuarios no vacios resuelven exito. No usar como autenticacion real.
// Datos de prueba: error.demo, bloqueo.demo, conexion.demo

export interface LoginCredentials {
  username: string;
  password: string;
}

export type LoginResult =
  | { success: true }
  | { success: false; reason: 'invalid_credentials' | 'unavailable' }
  | { success: false; reason: 'locked'; retryAt: number };

export const login = (credentials: LoginCredentials): Promise<LoginResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // Escenarios sinteticos del adaptador mock, no una politica de seguridad.
      if (credentials.username === 'bloqueo.demo') {
        resolve({
          success: false,
          reason: 'locked',
          retryAt: Date.now() + 300000,
        });
      } else if (credentials.username === 'conexion.demo') {
        resolve({ success: false, reason: 'unavailable' });
      } else if (
        credentials.username === 'error.demo' ||
        !credentials.username ||
        !credentials.password
      ) {
        resolve({ success: false, reason: 'invalid_credentials' });
      } else {
        resolve({ success: true });
      }
    }, 600);
  });
};

const REMEMBERED_USERNAME_KEY = 'decpat.rememberedUsername';

export const getRememberedUsername = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REMEMBERED_USERNAME_KEY);
};

export const setRememberedUsername = (username: string | null): void => {
  if (typeof window === 'undefined') return;
  if (username) {
    window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
  } else {
    window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
  }
};
