'use client';

import AppDialog from '@/sad-aml-shared/components/Organisms/AppDialog/AppDialog';
import { Button, ButtonColor } from '@/components/Atoms';
import styles from './HelpDialog.module.scss';

// Textos y datos del nodo Figma 43121:6886 ("Modal contacto ayuda"). D-14
// (preparacion-tecnica-visual.md) sigue pendiente de validacion de negocio;
// estos valores son los del diseno, no un contrato confirmado.
export const HELP_EMAIL = 'talentohumano@grupomutual.fi.cr';
export const HELP_PHONE = '2222-2222';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal de "Contacto de ayuda" (DEC-005B, nodo Figma 43121:6886). Usa
 * AppDialog (dialogo estandar de DecPat, DEC-002G).
 */
const HelpDialog = ({ open, onClose }: HelpDialogProps) => (
  <AppDialog
    open={open}
    onClose={onClose}
    size="sm"
    title="Contacto de ayuda"
    media={
      <i
        className={`ri-customer-service-line ${styles.help__icon}`}
        aria-hidden="true"
      />
    }
    description={
      <div>
        <p>
          <i className="ri-mail-line" aria-hidden="true" />
          <a href={`mailto:${HELP_EMAIL}`}>{HELP_EMAIL}</a>
        </p>
        <p>
          <i className="ri-phone-line" aria-hidden="true" />
          <a href={`tel:${HELP_PHONE}`}>{HELP_PHONE}</a>
        </p>
      </div>
    }
    descriptionClassName={styles.contacts}
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

export default HelpDialog;
