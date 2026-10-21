'use client';

import { useEffect } from 'react';
import { Button, ButtonColor } from '@/components/Atoms';
import {
  TOAST_MESSAGES,
  useNotification,
} from '@/components/Organisms/Notification/NotificationProvider';
import ConfidentialReport from '@/components/Pages/Declaration/ConfidentialReport/ConfidentialReport';
import type { StepProps } from '@/components/Pages/Declaration/DeclarationWizard/stepDefinitions';
import { getSession } from '@/services/SessionService';
import { useFinalization } from '@/utils/hooks/useFinalization';
import styles from './Completion.module.scss';

// Texto del juramento tal como lo dibuja Figma (nodo 43121:869). La variante
// oculta de Figma que nombra «Grupo Mutual Alajuela - La Vivienda» ya no se
// usa: la entidad es solo «Grupo Mutual» (confirmado por el usuario, D-25).
const OATH_PARAGRAPHS = [
  'Declaro bajo fe de juramento que la información suministrada es cierta, y que en caso de que esta información varie, debo actualizarla, incluyendo el respaldo documental de origen de fondos en el centro de negocio de su preferencia.',
  'Dejo constancia que he sido informado-a de la existencia de una base de datos personales, por lo que autorizo a los funcionarios-as del Conglomerado Financiero Grupo Mutual y empresas subsidiarias, para que almacenen y compartan dichos datos, asi como para que consulten en bases de datos públicas o privadas mis datos personales (calidades, domicilio, ingresos, teléfono, fotografía, comportamiento de pago, propiedades, personas vinculadas, etc). Asimismo, autorizo al Conglomerado Financiero Grupo Mutual y empresas subsidiarias, para que verifique mi información cuando lo considere necesario.',
  'Lo anterior con el fin de cumplir con la Ley 7786 y la política conozca a su empleado. Se me advirtió que esta autorización es facultativa, y que de no otorgarla la entidad podría rechazar mis solicitudes o la prestación de servicios. De acuerdo con la Ley de Protección de la Persona frente al tratamiento de Datos Personales, he sido informado-a de que podré solicitar rectificación o eliminación de mi información cuando así lo considere.',
];

/**
 * Paso 12, Declaración patrimonial completa (DEC-018A y DEC-018B, nodos Figma
 * 43121:1459 y 43121:866). Tiene dos vistas dentro del mismo paso: el
 * cuestionario confidencial y, tras «Terminar», el texto de la declaración
 * bajo juramento con un unico boton «Guardar». El estado de cual vista se ve
 * y del guardado vive en FinalizationService (no en el borrador). El guardado
 * es simulado: el exito se muestra solo cuando termina la respuesta simulada,
 * el error permite reintentar y mientras guarda el boton queda bloqueado para
 * que un clic repetido no envie dos veces.
 */
const Completion = ({ actions }: StepProps) => {
  const { status, leaveOath, submitDeclaration } = useFinalization();
  const { notify } = useNotification();

  // Si la persona se va a otro paso sin guardar, el juramento no queda
  // «abierto»: al volver ve de nuevo el cuestionario.
  useEffect(() => leaveOath, [leaveOath]);

  if (status === 'idle') {
    return (
      <>
        <ConfidentialReport />
        {actions}
      </>
    );
  }

  const handleSave = async () => {
    const result = await submitDeclaration(getSession()?.username);
    if (result === 'done') notify(TOAST_MESSAGES.saved);
    if (result === 'error') notify(TOAST_MESSAGES.requestFailed);
  };

  const sending = status === 'sending';
  const done = status === 'done';

  return (
    <div className={styles.completion}>
      <div className={styles.completion__oath}>
        {OATH_PARAGRAPHS.map(paragraph => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <div className={styles.completion__actions}>
        <Button
          type="button"
          text={done ? 'Guardado' : 'Guardar'}
          color={ButtonColor.Cta}
          size="large"
          spinner={sending}
          disabled={sending || done}
          onClick={handleSave}
        />
      </div>
    </div>
  );
};

export default Completion;
