'use client';

import { Button, ButtonColor } from '@/components/Atoms';
import AppDialog from '@/components/Organisms/AppDialog/AppDialog';
import styles from './ConfirmSaveDialog.module.scss';

interface ConfirmSaveDialogProps {
  open: boolean;
  /** Guardar de verdad: solo se llama con «Guardar». */
  onConfirm: () => void;
  /** Cancelar, la X o Escape: no guarda nada. */
  onClose: () => void;
}

/**
 * Modal «Confirmación» del guardado final de la declaración (Figma, nodo
 * 43310:470704, «Modal final»): se muestra al elegir «Guardar» en el
 * juramento (paso 12) y avisa que los datos ya no podrán cambiarse. El texto
 * es el de Figma tal cual, incluidas sus faltas de tilde («podran», «sera») y
 * la mención a «Guardar definitivamente» aunque el botón se llame «Guardar»;
 * se confirmará con el negocio. Usa AppDialog tamaño `md` (640 px).
 */
const ConfirmSaveDialog = ({
  open,
  onConfirm,
  onClose,
}: ConfirmSaveDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="md"
    title="Confirmación"
    description={
      <div>
        <p>
          Una vez que elija &quot;Guardar&quot;, los datos no podran cambiarse y
          su firma sera registrada en la declaración patrimonial, haciendo
          constar que la información suministrada es correcta y que se acepta lo
          indicado en el texto anterior.
        </p>
        <p>¿Está seguro(a) de que desea guardar su declaración?</p>
      </div>
    }
    descriptionClassName={styles.confirmSave__description}
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
          text="Guardar"
          color={ButtonColor.Cta}
          size="medium"
          type="button"
          onClick={onConfirm}
        />
      </>
    }
  />
);

export default ConfirmSaveDialog;
