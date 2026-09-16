// Servicio de acceso simulado (DEC-003). Sin backend ni contrato de API
// todavia (D-08, tasks/preparacion-tecnica-visual.md); cualquier usuario y
// contrasena no vacios resuelve exito. Los estados de error (credenciales
// incorrectas, bloqueo por intentos) son DEC-004, no este servicio.

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
}

export const login = (credentials: LoginCredentials): Promise<LoginResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: Boolean(credentials.username && credentials.password),
      });
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
