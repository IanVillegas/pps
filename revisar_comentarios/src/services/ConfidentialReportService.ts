// DEC-018A Cuestionario confidencial, separado del borrador patrimonial.
// ! [SIMULADO] Cuestionario confidencial en memoria. Reemplazar por el adaptador real o borrar al conectar el backend

import {
  CONFIDENTIAL_QUESTION_IDS,
  type ConfidentialAnswers,
  type ConfidentialQuestionId,
  type ConfidentialReportPayload,
} from '@/types/ConfidentialReport.types';

// Respuestas del cuestionario confidencial del paso 12, en memoria y
// SEPARADAS del borrador de la declaracion (DeclarationService)
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
 * con su detalle, para que no quede texto que contradiga la respuesta
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

/** Escribe el detalle de una pregunta contestada «Sí»; ignora las demas */
export const setConfidentialDetail = (
  id: ConfidentialQuestionId,
  detail: string
) => {
  if (!answers[id]) return;
  publish({ ...answers, [id]: { detail } });
};

export const clearConfidentialAnswers = () => publish(EMPTY);

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
