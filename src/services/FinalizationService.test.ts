import {
  clearFinalization,
  getFinalizationStatus,
  leaveOath,
  openOath,
  subscribeFinalization,
  submitDeclaration,
} from './FinalizationService';
import { clearDraft, getDraft, saveStepValues } from './DeclarationService';
import {
  getConfidentialAnswers,
  setConfidentialAnswer,
} from './ConfidentialReportService';
import { endSession, startMockSession } from './SessionService';

beforeEach(() => {
  jest.useFakeTimers();
  clearFinalization();
  clearDraft();
});
afterEach(() => jest.useRealTimers());

// Termina la espera simulada del backend.
const finishRequest = () => jest.advanceTimersByTimeAsync(1000);

describe('FinalizationService (simulacion del cierre)', () => {
  it('starts on the questionnaire', () => {
    expect(getFinalizationStatus()).toBe('idle');
  });

  it('opens the oath only from the questionnaire', () => {
    openOath();
    expect(getFinalizationStatus()).toBe('oath');
    openOath();
    expect(getFinalizationStatus()).toBe('oath');
  });

  it('goes back to the questionnaire if the oath was not saved', () => {
    openOath();
    leaveOath();
    expect(getFinalizationStatus()).toBe('idle');
  });

  it('does not save from the questionnaire', async () => {
    expect(await submitDeclaration()).toBe('ignored');
    expect(getFinalizationStatus()).toBe('idle');
  });

  it('shows sending first and success only once the answer arrives', async () => {
    openOath();
    const request = submitDeclaration();
    expect(getFinalizationStatus()).toBe('sending');

    await jest.advanceTimersByTimeAsync(500);
    expect(getFinalizationStatus()).toBe('sending');

    await finishRequest();
    expect(await request).toBe('done');
    expect(getFinalizationStatus()).toBe('done');
  });

  it('ignores a repeated save while sending and after it finished', async () => {
    openOath();
    const first = submitDeclaration();
    expect(await submitDeclaration()).toBe('ignored');
    await finishRequest();
    expect(await first).toBe('done');
    expect(await submitDeclaration()).toBe('ignored');
    expect(getFinalizationStatus()).toBe('done');
  });

  it('reports the synthetic error scenario and lets the person retry', async () => {
    openOath();
    const failing = submitDeclaration('cierre.error');
    await finishRequest();
    expect(await failing).toBe('error');
    expect(getFinalizationStatus()).toBe('error');

    const retry = submitDeclaration('otra.persona');
    expect(getFinalizationStatus()).toBe('sending');
    await finishRequest();
    expect(await retry).toBe('done');
  });

  it('does not leave the saved state when the person goes back', async () => {
    openOath();
    const request = submitDeclaration();
    await finishRequest();
    await request;
    leaveOath();
    expect(getFinalizationStatus()).toBe('done');
  });

  it('notifies subscribers and stops after unsubscribing', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeFinalization(listener);
    openOath();
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    leaveOath();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('session end', () => {
  it('erases the state and drops the answer of a save still in progress', async () => {
    startMockSession('demo');
    openOath();
    const request = submitDeclaration();
    endSession();
    expect(getFinalizationStatus()).toBe('idle');

    await finishRequest();
    expect(await request).toBe('ignored');
    expect(getFinalizationStatus()).toBe('idle');
  });
});

describe('separation from the draft and the confidential answers', () => {
  it('does not touch the draft or the confidential answers while saving', async () => {
    saveStepValues(3, { monto: 1 });
    setConfidentialAnswer('lifestyle', true);
    const draftBefore = getDraft();
    const answersBefore = getConfidentialAnswers();

    openOath();
    const request = submitDeclaration();
    await finishRequest();
    await request;

    expect(getDraft()).toBe(draftBefore);
    expect(getConfidentialAnswers()).toBe(answersBefore);
  });
});
