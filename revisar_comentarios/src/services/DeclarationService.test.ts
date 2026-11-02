import {
  acknowledgeIntro,
  clearDraft,
  getDraft,
  requestPersonalData,
  saveStepValues,
  subscribeDraft,
} from './DeclarationService';
import { endSession, startMockSession } from './SessionService';

beforeEach(() => clearDraft());

describe('DeclarationService', () => {
  it('keeps each step separate and replaces values immutably', () => {
    const before = getDraft();
    saveStepValues(1, { nombre: 'Ian' });
    saveStepValues(2, { hijos: 2 });
    expect(getDraft().steps).toEqual({ 1: { nombre: 'Ian' }, 2: { hijos: 2 } });
    expect(getDraft()).not.toBe(before);
    expect(before.steps).toEqual({});
  });

  it('notifies subscribers and stops after unsubscribing', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeDraft(listener);
    saveStepValues(1, { nombre: 'Ian' });
    acknowledgeIntro();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    saveStepValues(1, { nombre: 'Emmanuel' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('is erased when the session ends', () => {
    startMockSession('demo');
    saveStepValues(1, { nombre: 'Ian' });
    acknowledgeIntro();
    requestPersonalData();
    endSession();
    expect(getDraft()).toEqual({
      introAcknowledged: false,
      steps: {},
      personalDataRequests: 0,
    });
  });

  it('counts each request to complete the personal data', () => {
    requestPersonalData();
    requestPersonalData();
    expect(getDraft().personalDataRequests).toBe(2);
  });
});
