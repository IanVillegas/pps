'use client';

import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
import { Button, ButtonColor } from '@/components/Atoms';
import LogoHeader from '@/assets/images/LogoHeader';
import styles from './DeclarationIntroDialog.module.scss';

interface DeclarationIntroDialogProps {
  open: boolean;
  onClose: () => void;
}

// Texto del nodo Figma 43121:6787 ("Modal inicial mi declaracion"). La
// periodicidad (enero, un mes tras el ingreso) es la del diseno; D-14 sigue
// pendiente de validacion de negocio.
const DeclarationIntroDialog = ({
  open,
  onClose,
}: DeclarationIntroDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    className={styles.intro}
    title={
      <>
        <span className={styles.intro__logo} aria-hidden="true">
          <LogoHeader />
        </span>
        <span>Declaración Patrimonial Funcionarios</span>
      </>
    }
    description="La presente declaración debe ser llenada por todos los colaboradores de Grupo Mutual, una vez al año en el mes de enero. En el caso de personal de nuevo ingreso o que sea beneficiado con la recontratación, debe llenar el presente formulario 1 mes después de su ingreso."
    classNameDescription={styles.intro__description}
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

export default DeclarationIntroDialog;
