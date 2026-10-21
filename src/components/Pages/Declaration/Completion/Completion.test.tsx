import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationWizard from '@/components/Pages/Declaration/DeclarationWizard/DeclarationWizard';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { clearConfidentialAnswers } from '@/services/ConfidentialReportService';
import { acknowledgeIntro, clearDraft } from '@/services/DeclarationService';
import {
  clearFinalization,
  getFinalizationStatus,
} from '@/services/FinalizationService';
import { endSession, startMockSession } from '@/services/SessionService';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

// Paso 12 real, con las definiciones reales del wizard.
const setup = () =>
  render(
    <NotificationProvider>
      <DeclarationWizard stepId={12} />
    </NotificationProvider>
  );

const OATH_START =
  /Declaro bajo fe de juramento que la información suministrada es cierta/;
const SLOW = { timeout: 3000 };

beforeEach(() => {
  push.mockClear();
  clearDraft();
  acknowledgeIntro();
  clearConfidentialAnswers();
  clearFinalization();
});

describe('Completion (paso 12, cierre)', () => {
  it('starts on the questionnaire with "Terminar" enabled and no oath', () => {
    setup();
    expect(screen.getAllByRole('switch')).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Terminar' })).toBeEnabled();
    expect(screen.queryByText(OATH_START)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Guardar' })
    ).not.toBeInTheDocument();
  });

  it('"Terminar" shows the oath with a single "Guardar" button and no step change', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));

    expect(screen.getByText(OATH_START)).toBeInTheDocument();
    expect(
      screen.getByText(/Ley 7786 y la política conozca a su empleado/)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Regresar' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Terminar' })
    ).not.toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });

  it('blocks the button while saving and confirms only when the answer arrives', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    // Guardando: ni exito todavia ni boton disponible.
    expect(getFinalizationStatus()).toBe('sending');
    // El boton compartido muestra solo un spinner mientras carga (aria-busy).
    expect(screen.getByRole('button', { busy: true })).toBeDisabled();
    expect(
      screen.queryByText(TOAST_MESSAGES.saved.message)
    ).not.toBeInTheDocument();

    expect(
      await screen.findByText(TOAST_MESSAGES.saved.message, undefined, SLOW)
    ).toBeInTheDocument();
    expect(getFinalizationStatus()).toBe('done');
    expect(screen.getByRole('button', { name: 'Guardado' })).toBeDisabled();
  });

  it('saves only once when the button is clicked repeatedly', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    const save = screen.getByRole('button', { name: 'Guardar' });
    await userEvent.click(save);
    await userEvent.click(save);
    await userEvent.click(save);

    await screen.findByText(TOAST_MESSAGES.saved.message, undefined, SLOW);
    expect(screen.getAllByText(TOAST_MESSAGES.saved.message)).toHaveLength(1);
  });

  it('warns and lets the person try again when the save fails', async () => {
    startMockSession('cierre.error');
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(
      await screen.findByText(
        TOAST_MESSAGES.requestFailed.message,
        undefined,
        SLOW
      )
    ).toBeInTheDocument();
    expect(getFinalizationStatus()).toBe('error');
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
    expect(
      screen.queryByText(TOAST_MESSAGES.saved.message)
    ).not.toBeInTheDocument();
    endSession();
  });

  it('goes back to the questionnaire when the person leaves without saving', async () => {
    const { unmount } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    expect(getFinalizationStatus()).toBe('oath');
    unmount();
    expect(getFinalizationStatus()).toBe('idle');

    setup();
    expect(screen.getAllByRole('switch')).toHaveLength(8);
  });
});
