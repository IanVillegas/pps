// Paso 12, cuestionario confidencial (nodos Figma 43121:1459 y 43121:1124).
// Estos datos NO forman parte del borrador de la declaracion patrimonial: los
// recibe solo la Direccion de Desarrollo Humano y la declaracion no debe
// almacenar las respuestas (D-12). Por eso tienen sus propios tipos, su propio
// servicio y su propio estado.

/** Las ocho preguntas, en el orden de Figma. */
export const CONFIDENTIAL_QUESTION_IDS = [
  'lifestyle',
  'vacations',
  'debts',
  'ownBusiness',
  'afterHours',
  'absences',
  'blocksClients',
  'suspicious',
] as const;

export type ConfidentialQuestionId = (typeof CONFIDENTIAL_QUESTION_IDS)[number];

/** Respuesta afirmativa con el detalle de la denuncia (puede estar vacio). */
export interface ConfidentialAnswer {
  detail: string;
}

/**
 * Solo existen las preguntas contestadas «Sí»: una pregunta ausente equivale a
 * «No», que es como Figma abre la pantalla.
 */
export type ConfidentialAnswers = Partial<
  Record<ConfidentialQuestionId, ConfidentialAnswer>
>;

/** Lo que se enviaria a Desarrollo Humano (contrato por definir, D-12). */
export interface ConfidentialReportPayload {
  answers: {
    questionId: ConfidentialQuestionId;
    answer: 'si' | 'no';
    /** Solo viaja cuando la respuesta es «si» y la persona escribio algo. */
    detail?: string;
  }[];
}
