import { act, render, screen } from '@testing-library/react';
import {
  NotificationProvider,
  TOAST_MESSAGES,
  useNotification,
} from './NotificationProvider';

const Trigger = () => {
  const { notify } = useNotification();
  return (
    <>
      <button onClick={() => notify(TOAST_MESSAGES.saved)}>Agregar</button>
      <button onClick={() => notify(TOAST_MESSAGES.requestFailed)}>
        Fallar
      </button>
    </>
  );
};

const WarnTrigger = () => {
  const { notify } = useNotification();
  return (
    <button onClick={() => notify(TOAST_MESSAGES.processFailed)}>
      Advertir
    </button>
  );
};

const renderWithProvider = () =>
  render(
    <NotificationProvider>
      <Trigger />
    </NotificationProvider>
  );

describe('NotificationProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const click = (name: string) =>
    act(async () => {
      screen.getByRole('button', { name }).click();
    });

  it('shows nothing until a notification is requested', () => {
    renderWithProvider();
    expect(
      screen.queryByText('Guardado satisfactoriamente')
    ).not.toBeInTheDocument();
  });

  it('shows a success notification and closes it on its own', async () => {
    renderWithProvider();
    await click('Agregar');
    expect(screen.getByText('Guardado satisfactoriamente')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(4100);
    });
    expect(
      screen.queryByText('Guardado satisfactoriamente')
    ).not.toBeInTheDocument();
  });

  it('keeps an error visible until the person closes it', async () => {
    renderWithProvider();
    await click('Fallar');
    expect(
      screen.getByText('La solicitud no fue procesada. Inténtelo de nuevo')
    ).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    expect(
      screen.getByText('La solicitud no fue procesada. Inténtelo de nuevo')
    ).toBeInTheDocument();

    await act(async () => {
      screen.getByRole('button', { name: 'Cerrar notificación' }).click();
    });
    expect(
      screen.queryByText('La solicitud no fue procesada. Inténtelo de nuevo')
    ).not.toBeInTheDocument();
  });

  it('shows a warning that closes on its own after longer than a success', async () => {
    render(
      <NotificationProvider>
        <Trigger />
        <WarnTrigger />
      </NotificationProvider>
    );
    await click('Advertir');
    expect(
      screen.getByText('Error al procesar la solicitud. Inténtelo de nuevo')
    ).toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(4100);
    });
    expect(
      screen.getByText('Error al procesar la solicitud. Inténtelo de nuevo')
    ).toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    expect(
      screen.queryByText('Error al procesar la solicitud. Inténtelo de nuevo')
    ).not.toBeInTheDocument();
  });

  it('replaces the previous notification with the new one', async () => {
    renderWithProvider();
    await click('Fallar');
    await click('Agregar');
    expect(screen.getByText('Guardado satisfactoriamente')).toBeInTheDocument();
    expect(
      screen.queryByText('La solicitud no fue procesada. Inténtelo de nuevo')
    ).not.toBeInTheDocument();
  });

  it('gives the close button an accessible name', async () => {
    renderWithProvider();
    await click('Agregar');
    expect(
      screen.getByRole('button', { name: 'Cerrar notificación' })
    ).toBeInTheDocument();
  });

  it('fails clearly when used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Trigger />)).toThrow(
      'useNotification debe usarse dentro de un NotificationProvider'
    );
    spy.mockRestore();
  });
});
