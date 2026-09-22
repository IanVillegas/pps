import {
  acknowledgeIntro,
  clearDraft,
  getDraft,
  saveStepValues,
  subscribeDraft,
} from './DeclarationService';
import { endSession, startMockSession } from './SessionService';

beforeEach(() => clearDraft());

describe('DeclarationService', () => {
  it('keeps each step separate and replaces values immutably', () => {
    const before = getDraft();
    saveStepValues(1, { nombre: 'Ana' });
    saveStepValues(2, { hijos: 2 });
    expect(getDraft().steps).toEqual({ 1: { nombre: 'Ana' }, 2: { hijos: 2 } });
    expect(getDraft()).not.toBe(before);
    expect(before.steps).toEqual({});
  });

  it('notifies subscribers and stops after unsubscribing', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeDraft(listener);
    saveStepValues(1, { nombre: 'Ana' });
    acknowledgeIntro();
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    saveStepValues(1, { nombre: 'Luis' });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('is erased when the session ends', () => {
    startMockSession('demo');
    saveStepValues(1, { nombre: 'Ana' });
    acknowledgeIntro();
    endSession();
    expect(getDraft()).toEqual({ introAcknowledged: false, steps: {} });
  });
});
