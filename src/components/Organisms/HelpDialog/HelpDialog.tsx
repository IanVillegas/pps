'use client';

import Modal from '@/sad-aml-shared/components/Organisms/Modal/Modal';
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
 * Modal de "Contacto de ayuda" (DEC-005B, nodo Figma 43121:6886). Reutiliza
 * Modal/Button de sad-aml-shared, mismo patron que LoginFeedback.
 */
const HelpDialog = ({ open, onClose }: HelpDialogProps) => (
  <Modal
    open={open}
    onOpenChange={isOpen => {
      if (!isOpen) onClose();
    }}
    className={styles.help}
    icon={<i className="ri-customer-service-line" aria-hidden="true" />}
    iconColor="yellow"
    title={<span>Contacto de ayuda</span>}
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
    classNameDescription={styles.contacts}
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

export default HelpDialog;
