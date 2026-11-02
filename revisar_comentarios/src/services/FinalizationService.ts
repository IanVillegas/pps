// DEC-018B Guardado final de la declaración.
// ! [SIMULADO] Guardado final (juramento) simulado con espera de 800 ms. Reemplazar por el adaptador real o borrar al conectar el backend

// Estado de la finalizacion de la declaracion (paso 12, juramento), en
// memoria y SEPARADO del borrador y del cuestionario confidencial. SIMULACION
// del envio final: no hay backend ni respuesta real todavia
//
//   idle    -> cuestionario confidencial visible
//   oath    -> texto del juramento visible, listo para guardar
//   sending -> guardando; el boton esta bloqueado (un clic repetido no envia
//              dos veces)
//   done    -> la respuesta simulada confirmo el guardado
//   error   -> la respuesta simulada fallo; se puede reintentar
//
// El exito solo se declara cuando termina la respuesta simulada, nunca antes
export type FinalizationStatus = 'idle' | 'oath' | 'sending' | 'error' | 'done';

const DELAY_MS = 800;
// Escenario sintetico para ver el estado de error, igual que los usuarios
// `error.demo` de AuthService: no es una politica de seguridad
const ERROR_SCENARIO_USER = 'cierre.error';

let status: FinalizationStatus = 'idle';
// Cada limpieza (cierre de sesion) invalida los envios que siguen en curso
let generation = 0;
const listeners = new Set<() => void>();

const publish = (next: FinalizationStatus) => {
  status = next;
  listeners.forEach(listener => listener());
};

export const getFinalizationStatus = () => status;
export const getServerFinalizationStatus = (): FinalizationStatus => 'idle';
export const subscribeFinalization = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Pasa del cuestionario al juramento ("Terminar") */
export const openOath = () => {
  if (status === 'idle') publish('oath');
};

/** Vuelve al cuestionario si el juramento no se llego a guardar */
export const leaveOath = () => {
  if (status === 'oath' || status === 'error') publish('idle');
};

export type SubmitResult = 'done' | 'error' | 'ignored';

export const submitDeclaration = async (
  username?: string
): Promise<SubmitResult> => {
  if (status !== 'oath' && status !== 'error') return 'ignored';
  const attempt = generation;
  publish('sending');
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  // La sesion termino mientras se guardaba: la respuesta ya no aplica
  if (attempt !== generation) return 'ignored';
  const failed = username === ERROR_SCENARIO_USER;
  publish(failed ? 'error' : 'done');
  return failed ? 'error' : 'done';
};

export const clearFinalization = () => {
  generation += 1;
  publish('idle');
};
