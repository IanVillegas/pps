import * as Toast from '@radix-ui/react-toast';
import React, { type ReactNode, useEffect, useState } from 'react';
import { statusNotificationEnum } from '@/sad-aml-shared/utils/Enums/statusNotification';
import { RoundIcon } from '@/sad-aml-shared/components/Atoms';
import styles from '@/sad-aml-shared/components/Organisms/Notification/Notification.module.scss';

interface NotificationProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  status?: statusNotificationEnum;
  icon?: string;
  width?: number;
  iconColor?:
    | 'green'
    | 'gray'
    | 'yellow'
    | 'disabled'
    | 'dark'
    | 'red'
    | 'white';
  open?: boolean;
  setOpen?: (open: boolean) => void;
  autoCloseDelay?: number; // en milisegundos
}

const Notification = ({
  title,
  description,
  children,
  icon = 'ri-notification-line',
  status = statusNotificationEnum.INFO,
  width = 540,
  iconColor,
  open: controlledOpen,
  setOpen: controlledSetOpen,
  autoCloseDelay = 3000,
}: NotificationProps) => {
  // Soporte para controlado y no controlado
  const [uncontrolledOpen, uncontrolledSetOpen] = useState(true);
  const open =
    controlledOpen !== undefined && controlledSetOpen
      ? controlledOpen
      : uncontrolledOpen;
  const setOpen =
    controlledOpen !== undefined && controlledSetOpen
      ? controlledSetOpen
      : uncontrolledSetOpen;

  useEffect(() => {
    if (open && autoCloseDelay > 0) {
      const timer = setTimeout(() => setOpen(false), autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [open, autoCloseDelay, setOpen]);

  const colorNotification = (
    statusNotification: statusNotificationEnum
  ): 'green' | 'gray' | 'yellow' | 'disabled' | 'dark' | 'red' | 'white' => {
    switch (statusNotification) {
      case statusNotificationEnum.ERROR:
        return 'red';
      case statusNotificationEnum.SUCCESS:
        return 'green';
      case statusNotificationEnum.WARNING:
        return 'yellow';
      case statusNotificationEnum.DARK:
        return 'dark';
      case statusNotificationEnum.DISABLED:
        return 'disabled';
      case statusNotificationEnum.INFO:
        return 'white';
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={`${styles.toastRoot} ${styles[colorNotification(status)]}`}
        open={open}
        onOpenChange={setOpen}
        style={{ width: `${width}px !important` }}
        duration={autoCloseDelay}
      >
        <Toast.Description
          className={styles.notification}
          style={{ width: `${width}px !important` }}
        >
          <div className={styles.notification__icon}>
            <RoundIcon
              icon={<i className={icon}></i>}
              width={50}
              height={50}
              color={
                !!iconColor
                  ? iconColor
                  : colorNotification(status) === 'white'
                    ? 'green'
                    : colorNotification(status)
              }
            ></RoundIcon>
          </div>
          <div className={styles.notification__content}>
            {title && (
              <div className={styles.notification__content__title}>{title}</div>
            )}
            {description && (
              <div className={styles.notification__content__description}>
                {description}
              </div>
            )}
            <div className={styles.notification__content_children}>
              {children}
            </div>
          </div>
          <div className={styles.notification__closeIcon}>
            <button onClick={() => setOpen(false)}>
              <i className="ri-close-line"></i>
            </button>
          </div>
        </Toast.Description>
      </Toast.Root>
      <Toast.Viewport
        className={styles.toastViewport}
        style={{ width: `${width}px !important` }}
      />
    </Toast.Provider>
  );
};

export default Notification;
