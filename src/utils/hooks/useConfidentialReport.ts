import { useSyncExternalStore } from 'react';
import {
  getConfidentialAnswers,
  getServerConfidentialAnswers,
  setConfidentialAnswer,
  setConfidentialDetail,
  subscribeConfidentialAnswers,
} from '@/services/ConfidentialReportService';

/**
 * Lee las respuestas del cuestionario confidencial y expone como cambiarlas.
 * Es independiente de `useDeclaration`: el paso 12 no guarda nada en el
 * borrador de la declaracion.
 */
export const useConfidentialReport = () => {
  const answers = useSyncExternalStore(
    subscribeConfidentialAnswers,
    getConfidentialAnswers,
    getServerConfidentialAnswers
  );
  return {
    answers,
    setAnswer: setConfidentialAnswer,
    setDetail: setConfidentialDetail,
  };
};
