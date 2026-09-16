'use client';

import {
  useEffect,
  useRef,
  type Dispatch,
  type JSX,
  type MouseEvent,
  type SetStateAction,
} from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import styles from '@/sad-aml-shared/components/Organisms/Modal/Modal.module.scss';
import 'remixicon/fonts/remixicon.css';
import Button from '@/sad-aml-shared/components/Atoms/Button/Button';
import {
  hideModalTitle,
  includesErrorString,
} from '@/sad-aml-shared/utils/functions/validateModalAlertTitles';
import { ColorEnum } from '@/sad-aml-shared/types/enum/Color.enum';

interface ModalAlertProps {
  title?: string | JSX.Element | null;
  description?: string | JSX.Element | null;
  icon?: JSX.Element;
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
  onCloseChange?: (event: Event) => void;
  className?: string;
  buttonsFooter?: JSX.Element;
  iconColor?: 'green' | 'red' | 'yellow' | 'blue' | 'green300';
  classNameTitle?: string;
  classNameDescription?: string;
  showCloseIcon?: boolean;
  showLayoutButtons?: boolean;
  onCancelText?: string;
  onConfirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  contentCard?: JSX.Element;
  loading?: boolean;
  width?: string;
  height?: string;
}
const ModalAlert = ({
  title,
  description,
  icon,
  open,
  onOpenChange,
  className,
  buttonsFooter,
  iconColor,
  onCloseChange,
  classNameTitle,
  classNameDescription,
  showCloseIcon,
  showLayoutButtons,
  onCancelText,
  onConfirmText,
  onCancel,
  onConfirm,
  contentCard,
  loading,
  width,
  height,
}: ModalAlertProps) => {
  // Radix restaura el foco al elemento que lo abrio via su Trigger interno
  // (context.triggerRef); como este modal es totalmente controlado y no usa
  // AlertDialog.Trigger (se abre desde afuera cambiando el prop `open`), ese
  // ref nunca se llena y la restauracion automatica no ocurre (verificado:
  // sin esto, el foco cae en <body> al cerrar). Se guarda a mano observando
  // el prop `open` directo -- onOpenChange NO sirve para esto: Radix solo lo
  // llama cuando el cierre lo inicia el propio dialogo (Escape, overlay),
  // nunca cuando el padre cambia `open` de afuera.
  const previouslyFocused = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={styles.alertDialogOverlay} />
        <AlertDialog.Content
          className={[
            className || styles.alertDialogContent,
            (!title || hideModalTitle(title)) && styles.withoutTitle,
          ]
            .filter(Boolean)
            .join(' ')}
          onCloseAutoFocus={event => {
            if (previouslyFocused.current) {
              event.preventDefault();
              previouslyFocused.current.focus();
            }
          }}
          style={{ width, height }}
        >
          <div className={styles.closeIcon}>
            <AlertDialog.Cancel
              asChild
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                if (onCloseChange) {
                  return onCloseChange(event.nativeEvent);
                }
              }}
            >
              {(showCloseIcon == null || showCloseIcon) && (
                <button aria-label="Cerrar">
                  <i className="ri-close-line"></i>
                </button>
              )}
            </AlertDialog.Cancel>
          </div>
          {icon &&
            (!includesErrorString(title) ? (
              <div
                className={[iconColor && styles[iconColor], styles.icon]
                  .filter(Boolean)
                  .join(' ')}
              >
                {loading ? (
                  <span className={styles.spinner}>{icon}</span>
                ) : (
                  icon
                )}
              </div>
            ) : (
              <div className={`${styles.red} ${styles.icon}`}>
                <i className="ri-alert-line"></i>
              </div>
            ))}
          {title && !hideModalTitle(title) && (
            <AlertDialog.Title
              className={
                (classNameTitle && styles[classNameTitle]) ||
                styles.alertDialogTitle
              }
            >
              {title}
            </AlertDialog.Title>
          )}
          {description &&
            (typeof description === 'string' ? (
              <AlertDialog.Description
                className={
                  classNameDescription ?? styles.alertDialogDescription
                }
              >
                {description}
              </AlertDialog.Description>
            ) : (
              <AlertDialog.Description
                asChild
                className={
                  classNameDescription ?? styles.alertDialogDescription
                }
              >
                {description}
              </AlertDialog.Description>
            ))}
          {contentCard}
          <div className={styles.buttonsFooter}>{buttonsFooter}</div>
          {showLayoutButtons && (
            <div className={styles.buttonsFooter}>
              <Button
                text={onCancelText ?? 'Cancelar'}
                color={ColorEnum.Secondary}
                onClick={onCancel}
              />
              <Button text={onConfirmText ?? 'Continuar'} onClick={onConfirm} />
            </div>
          )}
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ModalAlert;
