import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeclarationWizard from '@/components/Pages/Declaration/DeclarationWizard/DeclarationWizard';
import {
  NotificationProvider,
  TOAST_MESSAGES,
} from '@/components/Organisms/Notification/NotificationProvider';
import { clearConfidentialAnswers } from '@/services/ConfidentialReportService';
import {
  acknowledgeIntro,
  clearDraft,
  saveStepValues,
} from '@/services/DeclarationService';
import {
  clearFinalization,
  getFinalizationStatus,
} from '@/services/FinalizationService';
import { endSession, startMockSession } from '@/services/SessionService';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: jest.fn() }),
}));

// Paso 12 real, con las definiciones reales del wizard.
const setup = () =>
  render(
    <NotificationProvider>
      <DeclarationWizard stepId={12} />
    </NotificationProvider>
  );

// «Guardar» del juramento abre el modal de confirmacion; el guardado empieza
// solo con el «Guardar» del modal (nodo Figma 43310:470704).
const clickSave = () =>
  userEvent.click(screen.getByRole('button', { name: 'Guardar' }));
const confirmSave = () =>
  userEvent.click(
    within(screen.getByRole('alertdialog')).getByRole('button', {
      name: 'Guardar',
    })
  );

const OATH_START =
  /Declaro bajo fe de juramento que la información suministrada es cierta/;
const SLOW = { timeout: 3000 };

beforeEach(() => {
  push.mockClear();
  clearDraft();
  acknowledgeIntro();
  // El paso 12 solo se ve con los datos personales (paso 1) completos.
  saveStepValues(1, {
    fullName: 'Ana Mora',
    idNumber: '1-1111-1111',
    age: '30',
    maritalStatus: 'soltero',
    lastAcademicDegree: 'Licenciatura',
    career: 'Administración',
    homePhone: '22222222',
    agency: 'agencia-1',
    cellPhone: '88888888',
    office: 'Oficina central',
    address: 'San José',
  });
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
    await clickSave();
    await confirmSave();

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

  it('asks for confirmation before saving and does not save until confirmed', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await clickSave();

    const dialog = screen.getByRole('alertdialog');
    expect(within(dialog).getByText('Confirmación')).toBeInTheDocument();
    expect(
      within(dialog).getByText(/los datos no podran cambiarse/)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        '¿Está seguro(a) de que desea guardar su declaración?'
      )
    ).toBeInTheDocument();
    expect(getFinalizationStatus()).toBe('oath');
  });

  it('cancelling the confirmation saves nothing and keeps the oath', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await clickSave();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(getFinalizationStatus()).toBe('oath');
    expect(screen.getByText(OATH_START)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
  });

  it('saves only once when the button is clicked repeatedly', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await clickSave();
    await confirmSave();
    // Ya guardando, el boton esta bloqueado: mas clics no hacen nada.
    const busy = screen.getByRole('button', { busy: true });
    await userEvent.click(busy);
    await userEvent.click(busy);

    await screen.findByText(TOAST_MESSAGES.saved.message, undefined, SLOW);
    expect(screen.getAllByText(TOAST_MESSAGES.saved.message)).toHaveLength(1);
  });

  it('warns and lets the person try again when the save fails', async () => {
    startMockSession('cierre.error');
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Terminar' }));
    await clickSave();
    await confirmSave();

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
