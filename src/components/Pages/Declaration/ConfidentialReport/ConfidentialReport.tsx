'use client';

import { useId } from 'react';
import { Switch, Textarea } from '@/components/Atoms';
import type { ConfidentialQuestionId } from '@/types/ConfidentialReport.types';
import { FIELD_MAX_LENGTH } from '@/utils/fieldLimits';
import { useConfidentialReport } from '@/utils/hooks/useConfidentialReport';
import styles from './ConfidentialReport.module.scss';

interface Question {
  id: ConfidentialQuestionId;
  text: string;
  /** Etiqueta solo para lectores de pantalla del campo de detalle. */
  detailLabel: string;
}

// Misma redaccion y orden que Figma (nodo 43121:1124). La primera pregunta es
// independiente; las otras siete cuelgan de «¿Conoce usted si algun
// compañero(a)...?» y van numeradas.
const LIFESTYLE: Question = {
  id: 'lifestyle',
  text: '¿Ha observado cambios notables en el estilo de vida de sus compañeros o jefatura que sean evidenciados por posesión (uso) o adquisición de joyas de alto valor, bienes muebles o inmuebles o alto consumo de compras compulsivas? Todos los anteriores adquiridos con entradas que usted considera no están de acuerdo a su nivel de ingreso',
  detailLabel:
    'Detalle de su denuncia sobre cambios notables en el estilo de vida',
};

const COLLEAGUE_QUESTIONS: Question[] = [
  {
    id: 'vacations',
    text: 'Esta siendo renuente a disfrutar de sus vacaciones',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 1',
  },
  {
    id: 'debts',
    text: 'Posee altos niveles de endeudamiento o frecuentemente recibe llamadas de otras entidades financieras para realizar cobros',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 2',
  },
  {
    id: 'ownBusiness',
    text: 'Posee un negocio propio y no lo ha reportado',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 3',
  },
  {
    id: 'afterHours',
    text: 'Permanece fuera de su horario laboral más allá de la hora de cierre o concurre fuera del horario habitual o sin aval de la jefatura correspondiente',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 4',
  },
  {
    id: 'absences',
    text: 'Frecuente e injustificadamente se ausenta de su lugar de trabajo',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 5',
  },
  {
    id: 'blocksClients',
    text: 'Impide que otros compañeros de trabajo atiendan a determinados clientes',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 6',
  },
  {
    id: 'suspicious',
    text: 'Tiene comportamientos sospechosos en cuanto al nivel de ingreso y procedencia de sus fondos',
    detailLabel: 'Detalle de su denuncia sobre la pregunta 7',
  },
];

interface QuestionRowProps {
  question: Question;
  /** Numero que antecede al texto; las preguntas independientes no lo llevan. */
  number?: number;
}

const QuestionRow = ({ question, number }: QuestionRowProps) => {
  const questionId = useId();
  const { answers, setAnswer, setDetail } = useConfidentialReport();
  const answer = answers[question.id];

  return (
    <section
      className={`${styles.confidential__row} ${number ? styles['confidential__row--indented'] : ''}`}
    >
      <div className={styles.confidential__header}>
        <p id={questionId} className={styles.confidential__question}>
          {number ? `${number}. ` : ''}
          {question.text}{' '}
          <span className={styles.confidential__required}>*</span>
        </p>
        <Switch
          checked={Boolean(answer)}
          aria-labelledby={questionId}
          onChange={yes => setAnswer(question.id, yes)}
        />
      </div>
      {answer && (
        <div className={styles.confidential__detail}>
          <p className={styles.confidential__instruction}>
            Desarrolle su denuncia, procure ser amplio con la informacion y
            detalle los hechos: descripción, ubicación, participantes (nombres y
            apellidos, si los hay).
          </p>
          <Textarea
            label={question.detailLabel}
            placeholder="Escribe aquí"
            maxLength={FIELD_MAX_LENGTH.confidentialDetail}
            value={answer.detail}
            onChange={event => setDetail(question.id, event.target.value)}
          />
        </div>
      )}
    </section>
  );
};

/**
 * Paso 12, Declaración patrimonial completa: cuestionario confidencial
 * (DEC-018A, nodos Figma 43121:1459 y 43121:1124). Ocho preguntas Si/No; al
 * responder «Sí» aparece la indicacion y el campo para desarrollar la
 * denuncia. Figma avisa que las respuestas las recibe unicamente la Directora
 * de Desarrollo Humano y que no quedan almacenadas en la declaracion
 * patrimonial, asi que este paso **no usa los valores ni el `onChange` del
 * wizard**: guarda sus respuestas en `ConfidentialReportService`, separado del
 * borrador (D-12). Ninguna pregunta exige texto: ni el detalle ni las
 * respuestas bloquean el avance.
 */
const ConfidentialReport = () => (
  <div className={styles.confidential}>
    <p className={styles.confidential__notice}>
      Este espacio está diseñado para que su denuncia sea recibida de forma
      confidencial únicamente por la Directora de Desarrollo Humano, quien
      atenderá directamente la situación. En su declaración patrimonial no
      quedarán almacenadas las respuestas a estas preguntas.
    </p>
    <QuestionRow question={LIFESTYLE} />
    <section className={styles.confidential__row}>
      <p className={styles.confidential__intro}>
        ¿Conoce usted si algún compañero(a)...?
      </p>
    </section>
    {COLLEAGUE_QUESTIONS.map((question, index) => (
      <QuestionRow key={question.id} question={question} number={index + 1} />
    ))}
  </div>
);

export default ConfidentialReport;
