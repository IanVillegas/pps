'use client';

// sad-aml-shared ya trae un ¨Notification¨, pero no es el mismo diseño de
// DecPat que se propuso , así que este proveedor usa Radix Toast directamente

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as Toast from '@radix-ui/react-toast';
import ToastIcon, { TOAST_COLORS, type ToastKind } from './ToastIcon';
import styles from './NotificationProvider.module.scss';

export type NotificationKind = ToastKind;

export interface NotificationOptions {
  kind: NotificationKind;
  message: string;
}

interface CurrentNotification extends NotificationOptions {
  id: number;
}

export const TOAST_MESSAGES = {
  saved: { kind: 'success', message: 'Guardado satisfactoriamente' },
  requestFailed: {
    kind: 'error',
    message: 'La solicitud no fue procesada. Inténtelo de nuevo',
  },
  processFailed: {
    kind: 'warning',
    message: 'Error al procesar la solicitud. Inténtelo de nuevo',
  },
  removed: { kind: 'success', message: 'Eliminado satisfactoriamente' },
} as const satisfies Record<string, NotificationOptions>;

// Exito y advertencia se cierran solos; el error se queda hasta que la
// persona lo cierre, para que no se pierda mientras corrige
const AUTOCLOSE_MS: Record<NotificationKind, number> = {
  success: 4000,
  warning: 6000,
  error: Infinity,
};

interface NotificationContextValue {
  notify: (options: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(
  null
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [current, setCurrent] = useState<CurrentNotification | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback((options: NotificationOptions) => {
    setCurrent(previous => ({ ...options, id: (previous?.id ?? 0) + 1 }));
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      <Toast.Provider swipeDirection="right" label="Notificación">
        {children}
        {current && (
          <Toast.Root
            // El id cambia con cada aviso: remonta el toast y reinicia su
            // autocierre aunque el anterior siga abierto.
            key={current.id}
            className={styles.toast}
            style={{ backgroundColor: TOAST_COLORS[current.kind] }}
            open={open}
            onOpenChange={setOpen}
            duration={AUTOCLOSE_MS[current.kind]}
          >
            <ToastIcon kind={current.kind} className={styles.toast__icon} />
            <Toast.Description className={styles.toast__message}>
              {current.message}
            </Toast.Description>
            <Toast.Close
              className={styles.toast__close}
              aria-label="Cerrar notificación"
            >
              <i className="ri-close-line" aria-hidden="true" />
            </Toast.Close>
          </Toast.Root>
        )}
        <Toast.Viewport className={styles.viewport} />
      </Toast.Provider>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification debe usarse dentro de un NotificationProvider'
    );
  }
  return context;
};
