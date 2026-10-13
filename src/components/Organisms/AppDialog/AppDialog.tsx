'use client';

import type { JSX, ReactNode } from 'react';
import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import styles from './AppDialog.module.scss';

/**
 * Escala de anchos de los modales de DecPat (los que dibuja Figma): sm 575 px,
 * md 640 px, lg 805 px y xl 891 px. El resto (X de cerrar, titulo, pie de
 * botones, scroll) es igual para todos.
 */
export type AppDialogSize = 'sm' | 'md' | 'lg' | 'xl';

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  size: AppDialogSize;
  title: string;
  /** El titulo sigue en el DOM para los lectores de pantalla pero no se ve. */
  hideTitle?: boolean;
  /** Icono o logo sobre el titulo (Figma: modales de ayuda, inicio y error). */
  media?: ReactNode;
  /**
   * Texto visible bajo el titulo (es la descripcion accesible del dialogo).
   * Para un formulario, que no lo dibuja, usar `srDescription`.
   */
  description?: JSX.Element | string;
  descriptionClassName?: string;
  /** Descripcion solo para lectores de pantalla, cuando Figma no dibuja texto. */
  srDescription?: string;
  /** Botones; van al final del contenido, dentro del area con scroll. */
  footer?: ReactNode;
  children?: ReactNode;
  onCloseAutoFocus?: (event: Event) => void;
}

/**
 * Dialogo estandar de DecPat (DEC-002G). Envuelve el `Modal` de
 * sad-aml-shared y fija en un solo lugar lo que Figma repite en todos los
 * modales: la X de cerrar (arriba a la derecha, alineada con el titulo), el
 * titulo (Work Sans 24 px centrado), el pie de dos botones de 205x48 y el
 * scroll. Cada dialogo solo aporta su ancho (`size`) y su contenido.
 *
 * El scroll va por dentro del modal (Figma, nodo 43277:5624): la tarjeta
 * recorta con sus esquinas redondeadas y la barra queda debajo de la X; si
 * fuera por fuera, la barra abarcaria todo el alto y el lado derecho del
 * modal quedaria con esquinas cuadradas.
 */
const AppDialog = ({
  open,
  onClose,
  size,
  title,
  hideTitle = false,
  media,
  description,
  descriptionClassName,
  srDescription,
  footer,
  children,
  onCloseAutoFocus,
}: AppDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    onCloseAutoFocus={onCloseAutoFocus}
    className={`${styles.dialog} ${styles[`dialog--${size}`]}`}
    title={
      <>
        {media}
        <span className={hideTitle ? styles.dialog__srOnly : undefined}>
          {title}
        </span>
      </>
    }
    description={description ?? srDescription}
    classNameDescription={
      description ? descriptionClassName : styles.dialog__srOnly
    }
    contentCard={
      <div className={styles.dialog__scroll}>
        <div className={styles.dialog__body}>{children}</div>
        {footer && <div className={styles.dialog__footer}>{footer}</div>}
      </div>
    }
  />
);

export default AppDialog;
