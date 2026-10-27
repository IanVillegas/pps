// [SIMULADO] Cuestionario confidencial en memoria (canal separado, D-12). Reemplazar por el adaptador real o borrar al conectar el backend: ver src/services/README.md.
import {
  CONFIDENTIAL_QUESTION_IDS,
  type ConfidentialAnswers,
  type ConfidentialQuestionId,
  type ConfidentialReportPayload,
} from '@/types/ConfidentialReport.types';

// Respuestas del cuestionario confidencial del paso 12, en memoria y
// SEPARADAS del borrador de la declaracion (DeclarationService): Figma dice
// que las respuestas no quedan almacenadas en la declaracion patrimonial y que
// solo las recibe Desarrollo Humano (D-12). Por eso este modulo tiene su
// propio estado y el paso 12 nunca pasa por `saveStepValues`. Sin contrato de
// backend todavia: nada de esto se envia a ningun lado (D-08). Se borra al
// cerrar sesion (ver SessionService.endSession) y nunca se guarda en
// localStorage.
const EMPTY: ConfidentialAnswers = {};

let answers: ConfidentialAnswers = EMPTY;
const listeners = new Set<() => void>();

const publish = (next: ConfidentialAnswers) => {
  answers = next;
  listeners.forEach(listener => listener());
};

export const getConfidentialAnswers = () => answers;
export const getServerConfidentialAnswers = () => EMPTY;
export const subscribeConfidentialAnswers = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Responde una pregunta. «Sí» abre una respuesta vacia; «No» la retira junto
 * con su detalle, para que no quede texto que contradiga la respuesta.
 */
export const setConfidentialAnswer = (
  id: ConfidentialQuestionId,
  yes: boolean
) => {
  if (yes) {
    publish({ ...answers, [id]: answers[id] ?? { detail: '' } });
    return;
  }
  const next = { ...answers };
  delete next[id];
  publish(next);
};

/** Escribe el detalle de una pregunta contestada «Sí»; ignora las demas. */
export const setConfidentialDetail = (
  id: ConfidentialQuestionId,
  detail: string
) => {
  if (!answers[id]) return;
  publish({ ...answers, [id]: { detail } });
};

export const clearConfidentialAnswers = () => publish(EMPTY);

/**
 * Arma lo que recibiria Desarrollo Humano. Es una funcion pura de las
 * respuestas: no recibe ni lee nada de la declaracion patrimonial, de modo que
 * ningun dato patrimonial puede viajar en este envio (ni viceversa). El
 * contrato real y el receptor estan por definir (D-12).
 */
export const buildConfidentialPayload = (
  source: ConfidentialAnswers
): ConfidentialReportPayload => ({
  answers: CONFIDENTIAL_QUESTION_IDS.map(questionId => {
    const entry = source[questionId];
    if (!entry) return { questionId, answer: 'no' as const };
    const detail = entry.detail.trim();
    return detail
      ? { questionId, answer: 'si' as const, detail }
      : { questionId, answer: 'si' as const };
  }),
});
