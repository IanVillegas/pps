'use client';

import Image from 'next/image';
import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import { Button, ButtonColor } from '@/components/Atoms';
import styles from './LoginFeedback.module.scss';

export type LoginFeedbackKind =
  | 'invalid_credentials'
  | 'locked'
  | 'unavailable';

export const formatRetryTime = (seconds: number) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

interface LoginFeedbackProps {
  kind: LoginFeedbackKind | null;
  remainingSeconds: number;
  onClose: () => void;
  onAfterClose: () => void;
}

const LoginFeedback = ({
  kind,
  remainingSeconds,
  onClose,
  onAfterClose,
}: LoginFeedbackProps) => {
  const locked = kind === 'locked';
  const title = locked
    ? 'Excedió el número de intentos'
    : 'No se pudo iniciar sesión';
  const message = locked
    ? remainingSeconds > 0
      ? 'Espere cinco minutos para volver a intentar.'
      : 'Ya puede volver a intentar.'
    : kind === 'invalid_credentials'
      ? 'El usuario o contraseña es incorrecto, favor verifique esta información'
      : 'No fue posible iniciar sesión. Intente nuevamente en unos momentos.';

  return (
    <Modal
      onCloseAutoFocus={event => {
        event.preventDefault();
        onAfterClose();
      }}
      open={kind !== null}
      onOpenChange={open => {
        if (!open) onClose();
      }}
      className={`${styles.feedback} ${!locked ? styles.compact : ''}`}
      title={<span>{title}</span>}
      description={message}
      classNameDescription={styles.description}
      icon={<Image src="/login-alert.svg" alt="" width={60} height={60} />}
      contentCard={
        locked ? (
          <div className={styles.details}>
            <span
              role="timer"
              aria-label="Tiempo restante"
              aria-live="off"
              className={styles.timer}
            >
              {formatRetryTime(remainingSeconds)}
            </span>
            <p>Para recibir asistencia comuníquese con soporte interno.</p>
          </div>
        ) : undefined
      }
      buttonsFooter={
        <Button
          text="Entendido"
          color={ButtonColor.Cta}
          size="medium"
          onClick={onClose}
        />
      }
    />
  );
};

export default LoginFeedback;
