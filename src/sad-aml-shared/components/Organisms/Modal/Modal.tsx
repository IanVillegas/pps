import type { Dispatch, JSX, SetStateAction } from 'react';
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
  marginContent?: string;
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
  marginContent,
}: ModalAlertProps) => (
  <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
    <AlertDialog.Trigger asChild></AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={styles.alertDialogOverlay} />
      <AlertDialog.Content
        className={`${className} ? ${className} : ${
          styles.alertDialogContent
        } ${(!title || hideModalTitle(title)) && styles.withoutTitle}`}
        style={{ width: marginContent ? marginContent : 535 }}
      >
        <div className={styles.closeIcon}>
          <AlertDialog.Cancel
            asChild
            onClick={(event: any) => {
              if (onCloseChange) {
                return onCloseChange(event);
              }
            }}
          >
            {(showCloseIcon == null || showCloseIcon) && (
              <button>
                <i className="ri-close-line"></i>
              </button>
            )}
          </AlertDialog.Cancel>
        </div>
        {icon &&
          (!includesErrorString(title) ? (
            <div className={`${iconColor && styles[iconColor]} ${styles.icon}`}>
              {loading ? <span className={styles.spinner}>{icon}</span> : icon}
            </div>
          ) : (
            <div className={`${styles['red']} ${styles.icon}`}>
              <i className="ri-alert-line"></i>
            </div>
          ))}
        {title && !hideModalTitle(title) && (
          <AlertDialog.Title
            className={`${
              classNameTitle && styles[classNameTitle]
            } ? ${styles.classNameTitle} : ${styles.alertDialogTitle}`}
          >
            {title}
          </AlertDialog.Title>
        )}
        {description && (
          <AlertDialog.Description
            className={`${
              classNameDescription ?? styles.alertDialogDescription
            }`}
            asChild={typeof description !== 'string' ? true : undefined}
          >
            <div>{description}</div>
          </AlertDialog.Description>
        )}
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

export default ModalAlert;
