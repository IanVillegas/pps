// [INTEGRACION] Cliente HTTP unico: es el unico lugar que habla con la API real (ver src/services/README.md).
// Cliente HTTP unico de DecPat (DEC-019A). Mientras NEXT_PUBLIC_API_BASE_URL
// este vacia el sistema trabaja con datos simulados (`isMockMode()`); al
// definirla, los adaptadores reales pasan por `apiRequest`. Aqui vive lo que
// el contrato (tasks/DEC-019A-contrato-api.md, seccion 2) fija para toda
// llamada: JSON, sesion por cookie, cuerpo de error comun y 401 = sesion
// vencida. Ninguna pantalla llama a este modulo: solo los servicios.

/** Error de una llamada a la API, con el cuerpo comun del contrato. */
export class ApiError extends Error {
  /** Estado HTTP; 0 si no hubo respuesta (red caida, CORS, tiempo agotado). */
  readonly status: number;
  /** `code` del cuerpo de error (por ejemplo `validation_error`), si lo hay. */
  readonly code?: string;
  /** Mensajes por campo (`errors` del cuerpo), si los hay. */
  readonly fieldErrors?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    options: { code?: string; fieldErrors?: Record<string, string> } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options.code;
    this.fieldErrors = options.fieldErrors;
  }
}

/** Mensaje que se muestra ante cualquier falla de red o 5xx (contrato, seccion 2). */
export const GENERIC_ERROR_MESSAGE =
  'La solicitud no fue procesada. Inténtelo de nuevo';

const baseUrl = () =>
  (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').trim().replace(/\/+$/, '');

/** Sin URL base configurada el sistema usa datos simulados. */
export const isMockMode = () => baseUrl() === '';

let unauthorizedHandler: (() => void) | null = null;

/**
 * Registra que hacer cuando el servidor responde 401 (sin sesion o sesion
 * vencida): el shell cierra la sesion local y lleva al acceso. `null` lo
 * desregistra.
 */
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler;
};

interface ApiRequestOptions {
  body?: unknown;
  signal?: AbortSignal;
}

interface ErrorBody {
  code?: unknown;
  message?: unknown;
  errors?: unknown;
}

const parseErrorBody = async (response: Response): Promise<ErrorBody> => {
  try {
    return (await response.json()) as ErrorBody;
  } catch {
    return {};
  }
};

/**
 * Llama a la API real. Devuelve el JSON de la respuesta (`undefined` con
 * 204) o lanza `ApiError`. Una falla de red o un 5xx lanzan el mensaje
 * generico del contrato; un 401 ademas avisa al manejador registrado.
 */
export const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  { body, signal }: ApiRequestOptions = {}
): Promise<T> => {
  if (isMockMode()) {
    throw new ApiError(0, 'La API no está configurada (modo simulado)');
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method,
      credentials: 'include',
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    // Una peticion cancelada a proposito no es una falla del servicio.
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(0, GENERIC_ERROR_MESSAGE);
  }

  if (response.status === 401) unauthorizedHandler?.();

  if (!response.ok) {
    const data = await parseErrorBody(response);
    const serverFailure = response.status >= 500;
    throw new ApiError(
      response.status,
      serverFailure || typeof data.message !== 'string'
        ? GENERIC_ERROR_MESSAGE
        : data.message,
      {
        code: typeof data.code === 'string' ? data.code : undefined,
        fieldErrors:
          data.errors && typeof data.errors === 'object'
            ? (data.errors as Record<string, string>)
            : undefined,
      }
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};
