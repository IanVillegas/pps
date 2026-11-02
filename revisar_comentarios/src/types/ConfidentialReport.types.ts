// DEC-018A Cuestionario confidencial.
// Paso 12, cuestionario confidencial

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

/** Respuesta afirmativa con el detalle de la denuncia (puede estar vacio) */
export interface ConfidentialAnswer {
  detail: string;
}

export type ConfidentialAnswers = Partial<
  Record<ConfidentialQuestionId, ConfidentialAnswer>
>;

/** Lo que se enviaria a Desarrollo Humano */
export interface ConfidentialReportPayload {
  answers: {
    questionId: ConfidentialQuestionId;
    answer: 'si' | 'no';
    /** Solo viaja cuando la respuesta es «si» y la persona escribio algo */
    detail?: string;
  }[];
}
