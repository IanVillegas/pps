'use client';

// DEC-006B Diálogo informativo inicial de la declaración.

import AppDialog from '@/sad-aml-shared/components/Organisms/AppDialog/AppDialog';
import { Button, ButtonColor } from '@/components/Atoms';
import LogoHeader from '@/assets/images/LogoHeader';
import styles from './DeclarationIntroDialog.module.scss';

interface DeclarationIntroDialogProps {
  open: boolean;
  onClose: () => void;
}

// Modal inicial mi declaracion. Periodo en enero, un mes tras el ingreso
const DeclarationIntroDialog = ({
  open,
  onClose,
}: DeclarationIntroDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="md"
    title="Declaración Patrimonial Funcionarios"
    media={
      <span className={styles.intro__logo} aria-hidden="true">
        <LogoHeader />
      </span>
    }
    description="La presente declaración debe ser llenada por todos los colaboradores de Grupo Mutual, una vez al año en el mes de enero. En el caso de personal de nuevo ingreso o que sea beneficiado con la recontratación, debe llenar el presente formulario 1 mes después de su ingreso."
    descriptionClassName={styles.intro__description}
    footer={
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
