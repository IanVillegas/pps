import {
  buildConfidentialPayload,
  clearConfidentialAnswers,
  getConfidentialAnswers,
  setConfidentialAnswer,
  setConfidentialDetail,
  subscribeConfidentialAnswers,
} from './ConfidentialReportService';
import { getDraft, saveStepValues, clearDraft } from './DeclarationService';
import { endSession, startMockSession } from './SessionService';
import { CONFIDENTIAL_QUESTION_IDS } from '@/types/ConfidentialReport.types';

beforeEach(() => {
  clearConfidentialAnswers();
  clearDraft();
});

describe('ConfidentialReportService', () => {
  it('starts with no answers, which means No in every question', () => {
    expect(getConfidentialAnswers()).toEqual({});
  });

  it('opens an empty answer when a question is answered Yes', () => {
    setConfidentialAnswer('vacations', true);
    expect(getConfidentialAnswers()).toEqual({ vacations: { detail: '' } });
  });

  it('keeps the detail when the same question is answered Yes again', () => {
    setConfidentialAnswer('debts', true);
    setConfidentialDetail('debts', 'Recibe llamadas de cobro');
    setConfidentialAnswer('debts', true);
    expect(getConfidentialAnswers().debts?.detail).toBe(
      'Recibe llamadas de cobro'
    );
  });

  it('drops the answer and its detail when a question goes back to No', () => {
    setConfidentialAnswer('absences', true);
    setConfidentialDetail('absences', 'Se ausenta los viernes');
    setConfidentialAnswer('absences', false);
    expect(getConfidentialAnswers()).toEqual({});
  });

  it('ignores a detail for a question that was not answered Yes', () => {
    setConfidentialDetail('suspicious', 'Texto suelto');
    expect(getConfidentialAnswers()).toEqual({});
  });

  it('replaces the answers immutably and notifies subscribers until they unsubscribe', () => {
    const before = getConfidentialAnswers();
    const listener = jest.fn();
    const unsubscribe = subscribeConfidentialAnswers(listener);
    setConfidentialAnswer('lifestyle', true);
    expect(getConfidentialAnswers()).not.toBe(before);
    expect(before).toEqual({});
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    setConfidentialAnswer('lifestyle', false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('is erased when the session ends', () => {
    startMockSession('demo');
    setConfidentialAnswer('lifestyle', true);
    setConfidentialDetail('lifestyle', 'Detalle reservado');
    endSession();
    expect(getConfidentialAnswers()).toEqual({});
  });
});

describe('separation from the patrimonial draft (D-12)', () => {
  it('never writes the answers into the declaration draft', () => {
    saveStepValues(11, { penal: false });
    setConfidentialAnswer('lifestyle', true);
    setConfidentialDetail('lifestyle', 'Detalle reservado');

    expect(getDraft().steps[12]).toBeUndefined();
    expect(JSON.stringify(getDraft())).not.toContain('Detalle reservado');
    expect(JSON.stringify(getDraft())).not.toContain('lifestyle');
  });

  it('does not touch the confidential answers when the draft changes or is cleared', () => {
    setConfidentialAnswer('ownBusiness', true);
    saveStepValues(3, { monto: 1 });
    clearDraft();
    expect(getConfidentialAnswers()).toEqual({ ownBusiness: { detail: '' } });
  });
});

describe('buildConfidentialPayload', () => {
  it('lists the eight questions in order, all No when nothing was answered', () => {
    const payload = buildConfidentialPayload({});
    expect(payload.answers.map(entry => entry.questionId)).toEqual([
      ...CONFIDENTIAL_QUESTION_IDS,
    ]);
    expect(payload.answers.every(entry => entry.answer === 'no')).toBe(true);
  });

  it('sends the trimmed detail only for the questions answered Yes', () => {
    const payload = buildConfidentialPayload({
      vacations: { detail: '  Nunca toma vacaciones  ' },
      debts: { detail: '   ' },
    });
    expect(payload.answers.find(a => a.questionId === 'vacations')).toEqual({
      questionId: 'vacations',
      answer: 'si',
      detail: 'Nunca toma vacaciones',
    });
    expect(payload.answers.find(a => a.questionId === 'debts')).toEqual({
      questionId: 'debts',
      answer: 'si',
    });
    expect(payload.answers.find(a => a.questionId === 'absences')).toEqual({
      questionId: 'absences',
      answer: 'no',
    });
  });

  it('carries nothing but the confidential answers, whatever the patrimonial draft holds', () => {
    saveStepValues(1, { nombre: 'Ana Mora', cedula: '1-1111-1111' });
    saveStepValues(8, { credits: [{ loanNumber: 'OP-0001' }] });
    setConfidentialAnswer('lifestyle', true);

    const payload = JSON.stringify(
      buildConfidentialPayload(getConfidentialAnswers())
    );
    expect(payload).not.toContain('Ana Mora');
    expect(payload).not.toContain('1-1111-1111');
    expect(payload).not.toContain('OP-0001');
    expect(Object.keys(JSON.parse(payload))).toEqual(['answers']);
  });
});
