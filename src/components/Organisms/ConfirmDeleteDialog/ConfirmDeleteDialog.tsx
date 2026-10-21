'use client';

import { Button, ButtonColor } from '@/components/Atoms';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import styles from './ConfirmDeleteDialog.module.scss';

interface ConfirmDeleteDialogProps {
  open: boolean;
  /** Eliminar de verdad: solo se llama con «Sí, eliminar». */
  onConfirm: () => void;
  /** Cancelar, la X o Escape: no elimina nada. */
  onClose: () => void;
}

/**
 * Modal de confirmacion para eliminar un registro (Figma, nodo 43294:2166,
 * «Modal confirmacion eliminacion»): icono de alerta rojo de 60 px, la
 * pregunta y los botones «Cancelar» y «Sí, eliminar». Va en todas las tablas
 * que permiten eliminar (lo muestra RecordsTable). Usa AppDialog tamano `md`
 * (640 px) como el aviso de error del login; Figma no dibuja titulo, asi que
 * queda solo para los lectores de pantalla.
 */
const ConfirmDeleteDialog = ({
  open,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="md"
    title="Eliminar registro"
    hideTitle
    media={
      <i
        className={`ri-alert-line ${styles.confirm__icon}`}
        aria-hidden="true"
      />
    }
    description="¿Está seguro(a) que desea eliminar este registro del sistema?"
    descriptionClassName={styles.confirm__description}
    footer={
      <>
        <Button
          text="Cancelar"
          color={ButtonColor.Secondary}
          size="medium"
          type="button"
          onClick={onClose}
        />
        <Button
          text="Sí, eliminar"
          color={ButtonColor.Cta}
          size="medium"
          type="button"
          onClick={onConfirm}
        />
      </>
    }
  />
);

export default ConfirmDeleteDialog;
